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
  seedWaived,
  seedRefused,
  seedImprinted,
  fingerprint,
  signals,
  waivedSignal,
  refusedSignal,
  imprintedSignal,
  skipRefusesSignal,
  autoSucceedsSignal,
  noCardRenderedSignal,
  firstPublishGateSignal,
  noninteractiveSelfReportSignal,
  folioImprinted,
  modeRefuses,
  HOLD,
  ALARM,
  MEASURED,
  CHIPS,
  VERDICTS,
  COUSINS,
  MODE_COLUMNS,
  FIRST_PUBLISH_GATE,
  IDLE_WORD,
  SEEDED_WORD
} from "./imprimatur.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const page = readFileSync(join(root, "index.html"), "utf8");
const readme = readFileSync(join(root, "README.md"), "utf8");
const hookReadme = readFileSync(join(root, "hook", "README.md"), "utf8");
const dataReadme = readFileSync(join(root, "data", "README.md"), "utf8");

test("primary 92740 fixture scores refused", () => {
  const primary = JSON.parse(readFileSync(join(root, "data", "92740.json"), "utf8"));
  const out = decide(primary);
  assert.equal(out.verdict, "refused");
  assert.equal(out.refused, true);
  assert.ok(out.chips.includes("refused"));
  assert.ok(ALARM.has(out.verdict));
});

test("empty / idle probe is waived", () => {
  const out = decide({});
  assert.equal(out.verdict, "waived");
  assert.equal(out.waived, true);
  assert.equal(out.refused, false);
  assert.ok(HOLD.has("waived"));
  assert.equal(IDLE_WORD, "waived");
});

test("waived fixture is hold", () => {
  const idle = JSON.parse(readFileSync(join(root, "data", "waived.json"), "utf8"));
  const out = decide(idle);
  assert.equal(out.verdict, "waived");
  assert.equal(out.waived, true);
  assert.ok(HOLD.has(out.verdict));
});

test("seeded refused scores refused", () => {
  const out = decide(seedRefused());
  assert.equal(out.verdict, "refused");
  assert.equal(out.refused, true);
  assert.ok(out.chips.includes("refused"));
  assert.ok(out.chips.includes("skip-refuses"));
  assert.ok(out.chips.includes("no-card-rendered"));
  assert.ok(ALARM.has(out.verdict));
});

test("imprinted seed is a hold", () => {
  const out = decide(seedImprinted());
  assert.equal(out.verdict, "imprinted");
  assert.equal(out.imprinted, true);
  assert.equal(out.refused, false);
  assert.ok(HOLD.has(out.verdict));
  assert.equal(SEEDED_WORD, "refused");
});

test("waived seed is idle hold", () => {
  const out = decide(seedWaived());
  assert.equal(out.verdict, "waived");
  assert.equal(out.waived, true);
  assert.ok(HOLD.has("waived"));
});

test("skip-refuses chip", () => {
  const out = decide({ seed: "skip-refuses", skipRefuses: true });
  assert.equal(out.verdict, "skip-refuses");
  assert.equal(out.refused, true);
  assert.match(out.reasons.join(" "), /Skip all approvals/);
  assert.match(out.reasons.join(" "), /first publish/);
});

test("auto-succeeds chip", () => {
  const out = decide({ seed: "auto-succeeds", autoSucceeds: true });
  assert.equal(out.verdict, "auto-succeeds");
  assert.match(out.reasons.join(" "), /Automatically approve/);
  assert.match(out.reasons.join(" "), /publishes normally/);
});

test("skip vs auto contrast", () => {
  const skip = decide({ seed: "skip-refuses", skipRefuses: true });
  const auto = decide({ seed: "auto-succeeds", autoSucceeds: true });
  assert.equal(skip.verdict, "skip-refuses");
  assert.equal(auto.verdict, "auto-succeeds");
  assert.equal(modeRefuses("skip"), true);
  assert.equal(modeRefuses("auto"), false);
  assert.equal(MODE_COLUMNS.find((c) => c.id === "skip").firstPublish, "refused");
  assert.equal(MODE_COLUMNS.find((c) => c.id === "auto").firstPublish, "succeeds");
});

test("no-card-rendered chip", () => {
  const out = decide({ seed: "no-card-rendered", noCardRendered: true });
  assert.equal(out.verdict, "no-card-rendered");
  assert.match(out.reasons.join(" "), /no approval card/);
  assert.match(out.reasons.join(" "), /refuses at once/);
});

test("first-publish-gate chip", () => {
  const out = decide({ seed: "first-publish-gate", firstPublishGate: true });
  assert.equal(out.verdict, "first-publish-gate");
  assert.match(out.reasons.join(" "), /approval card/);
  assert.match(out.reasons.join(" "), /19 August 2026/);
});

test("noninteractive-self-report chip", () => {
  const out = decide({ seed: "noninteractive-self-report", noninteractiveSelfReport: true });
  assert.equal(out.verdict, "noninteractive-self-report");
  assert.match(out.reasons.join(" "), /non-interactive/);
  assert.match(out.reasons.join(" "), /OAuth cannot run/);
});

test("cousins cite-only", () => {
  const out = decide({
    seed: "cousins",
    cousinsCiteOnly: [88997, 89967, 91883]
  });
  assert.equal(out.verdict, "cousins");
  assert.match(out.reasons.join(" "), /88997/);
  assert.match(out.reasons.join(" "), /89967/);
  assert.match(out.reasons.join(" "), /91883/);
  assert.match(out.reasons.join(" "), /cloud routines/);
});

test("has-clear-repro chip from labels", () => {
  const out = decide({ seed: "has-clear-repro", hasClearRepro: true });
  assert.equal(out.verdict, "has-clear-repro");
  assert.match(out.reasons.join(" "), /has-clear-repro/);
  assert.match(out.reasons.join(" "), /has repro/);
});

test("analyze / score / handle / seeds / scoreFields", () => {
  const idle = analyze({});
  assert.equal(idle.verdict, "waived");
  assert.equal(score(seedImprinted()).verdict, "imprinted");
  assert.equal(handle('{"seed":"refused","refused":true}').verdict, "refused");
  assert.equal(handle({ seed: "imprinted", imprinted: true }).verdict, "imprinted");
  const bag = seeds();
  assert.equal(decide(bag.waived).verdict, "waived");
  assert.equal(decide(bag.refused).verdict, "refused");
  assert.equal(decide(bag.imprinted).verdict, "imprinted");
  assert.equal(scoreFields(seedRefused()).refused, true);
});

test("fingerprint and signals detect imprimatur facts", () => {
  assert.equal(
    waivedSignal("idle folio is waived; pin idle waived; skip would cover; no first-publish refusal"),
    true
  );
  assert.equal(
    refusedSignal("folio refused; needs the approval card; do not retry the publish"),
    true
  );
  assert.equal(imprintedSignal("folio already imprinted; skip is treated like auto"), true);
  assert.equal(skipRefusesSignal("skip-refuses Skip all approvals fail first publish skip"), true);
  assert.equal(
    autoSucceedsSignal("auto-succeeds Automatically approve publish publishes normally"),
    true
  );
  assert.equal(
    noCardRenderedSignal("no-card-rendered no approval card card is never rendered"),
    true
  );
  assert.equal(
    firstPublishGateSignal("first-publish-gate first publish to an Artifact mcp__cowork__update_artifact"),
    true
  );
  assert.equal(
    noninteractiveSelfReportSignal("noninteractive-self-report non-interactive OAuth cannot run"),
    true
  );
  const hits = signals(seedRefused());
  assert.equal(hits.refused || hits.skipRefuses || hits.noCardRendered, true);
  const print = fingerprint(seedRefused());
  assert.equal(print.skipRefuses, true);
  assert.equal(print.refusedHit, true);
});

test("fingerprint scores imprinted clean folio path", () => {
  const print = fingerprint(seedImprinted());
  assert.equal(print.imprintedClean, true);
  assert.equal(print.refusedHit, false);
  const out = decide({ ...seedImprinted(), seed: "imprinted" });
  assert.equal(out.imprinted, true);
  assert.equal(out.verdict, "imprinted");
  assert.equal(folioImprinted(seedImprinted()), true);
  assert.equal(folioImprinted(seedRefused()), false);
});

test("classify idle vs hold flags", () => {
  const alarm = classify(seedRefused());
  assert.equal(alarm.refused, true);
  const hold = classify(seedImprinted());
  assert.equal(hold.imprinted, true);
  const idle = classify(seedWaived());
  assert.equal(idle.waived, true);
});

test("modeRefuses encodes skip vs auto", () => {
  assert.equal(modeRefuses("skip"), true);
  assert.equal(modeRefuses("auto"), false);
  assert.equal(modeRefuses("unknown"), null);
});

test("mode columns are skip / auto", () => {
  assert.ok(MODE_COLUMNS.length === 2);
  assert.ok(MODE_COLUMNS.some((row) => row.id === "skip" && row.firstPublish === "refused"));
  assert.ok(MODE_COLUMNS.some((row) => row.id === "auto" && row.firstPublish === "succeeds"));
});

test("first publish gate encodes skip refuse vs auto succeed", () => {
  assert.match(FIRST_PUBLISH_GATE.skip, /refuses at once/);
  assert.match(FIRST_PUBLISH_GATE.auto, /publishes normally/);
  assert.match(FIRST_PUBLISH_GATE.docs, /Get started with Claude Cowork/);
});

test("measured facts from #92740", () => {
  assert.equal(MEASURED.issue, 92740);
  assert.equal(MEASURED.state, "open");
  assert.deepEqual(MEASURED.labels, [
    "bug",
    "has repro",
    "platform:windows",
    "area:cowork",
    "area:permissions"
  ]);
  assert.equal(MEASURED.filed, "2026-09-07T21:55:35Z");
  assert.equal(MEASURED.desktop, "Claude Desktop 1.46388.4 (Cowork, MSIX Claude_pzs8sxrjxfjjc)");
  assert.equal(MEASURED.os, "Windows 11 Pro build 26100 x64");
  assert.equal(MEASURED.platform, "windows");
  assert.equal(MEASURED.regression, true);
  assert.match(MEASURED.regressionNote, /19 August 2026/);
  assert.match(MEASURED.regressionNote, /mcp__cowork__update_artifact/);
  assert.equal(MEASURED.skipMode, "Skip all approvals");
  assert.equal(MEASURED.autoMode, "Automatically approve");
  assert.match(MEASURED.errorText, /needs the approval card/);
  assert.equal(MEASURED.cardRendered, false);
  assert.equal(MEASURED.refusesAtOnce, true);
  assert.equal(MEASURED.autoPublishesNormally, true);
  assert.equal(MEASURED.noninteractiveSelfReport, true);
  assert.equal(MEASURED.oauthCannotRun, true);
  assert.equal(IDLE_WORD, "waived");
  assert.equal(SEEDED_WORD, "refused");
});

test("HOLD is waived/imprinted; ALARM is refused family", () => {
  assert.ok(HOLD.has("waived"));
  assert.ok(HOLD.has("imprinted"));
  assert.equal(ALARM.has("waived"), false);
  assert.equal(ALARM.has("imprinted"), false);
  for (const chip of [
    "refused",
    "skip-refuses",
    "auto-succeeds",
    "no-card-rendered",
    "first-publish-gate",
    "noninteractive-self-report",
    "cousins",
    "has-clear-repro"
  ]) {
    assert.ok(ALARM.has(chip), chip);
  }
  assert.deepEqual(CHIPS, VERDICTS);
  assert.deepEqual(VERDICTS, [
    "waived",
    "refused",
    "imprinted",
    "skip-refuses",
    "auto-succeeds",
    "no-card-rendered",
    "first-publish-gate",
    "noninteractive-self-report",
    "has-clear-repro",
    "cousins"
  ]);
});

test("cousins table cites cloud routines Artifact permission gate family", () => {
  assert.deepEqual(
    COUSINS.map((c) => c.issue),
    [88997, 89967, 91883]
  );
});

test("fixtures encode issue facts and score their seeds", () => {
  const files = [
    "waived.json",
    "refused.json",
    "imprinted.json",
    "92740.json",
    "skip-refuses.json",
    "auto-succeeds.json",
    "no-card-rendered.json",
    "first-publish-gate.json",
    "noninteractive-self-report.json",
    "cousins.json",
    "fixtures.json",
    "has-clear-repro.json"
  ];
  for (const name of files) {
    const raw = readFileSync(join(root, "data", name), "utf8");
    assert.match(raw, /92740|imprimatur|waived|refused|imprinted/i);
    if (name !== "fixtures.json") {
      const fixture = JSON.parse(raw);
      const out = decide(fixture);
      assert.ok(VERDICTS.includes(out.verdict), `${name} → ${out.verdict}`);
    }
  }
  const index = JSON.parse(readFileSync(join(root, "data", "fixtures.json"), "utf8"));
  assert.equal(index.narrativeNotFixture.idle, "waived");
  assert.equal(index.narrativeNotFixture.seeded, "refused");
  assert.equal(index.narrativeNotFixture.noLiveSessions, true);
  assert.equal(index.narrativeNotFixture.noPayloads, true);
  assert.equal(index.narrativeNotFixture.noSecrets, true);
  assert.ok(index.narrativeNotFixture.labels.includes("has repro"));
  assert.ok(index.narrativeNotFixture.labels.includes("area:cowork"));
  assert.ok(index.narrativeNotFixture.labels.includes("area:permissions"));
  const listed = readdirSync(join(root, "data"));
  assert.ok(listed.includes("README.md"));
});

test("living page is a censor stamp desk, not a clone", () => {
  assert.match(page, /Playfair Display/);
  assert.match(page, /DM Sans/);
  assert.match(page, /Fira Code/);
  assert.doesNotMatch(page, /Newsreader/);
  assert.doesNotMatch(page, /Sora/);
  assert.doesNotMatch(page, /IBM Plex Mono/);
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
  assert.doesNotMatch(page, /Work Sans/);
  assert.match(page, /refused/);
  assert.match(page, /imprinted/);
  assert.match(page, /\bwaived\b/);
  assert.match(page, /#92740/);
  assert.match(page, /Imprimatur/);
  assert.match(page, /embed/);
  assert.match(page, /\?embed=1/);
  assert.match(page, /08:50 \/ hermes catalog #214 \/ #92740/);
  assert.match(page, /Score refused/);
  assert.match(page, /Admit imprinted/);
  assert.match(page, /Pin idle waived/);
  assert.match(page, /Reset to waived/);
  assert.match(page, /Skip all approvals/);
  assert.match(page, /Automatically approve/);
  assert.match(page, /needs the approval card/);
  assert.match(page, /nihil-obstat/);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /88997/);
  assert.match(page, /89967/);
  assert.match(page, /91883/);
});

test("page stays off neighboring UIs and prior idle words", () => {
  assert.doesNotMatch(page, /herald's byname/i);
  assert.doesNotMatch(page, /epithet registration/i);
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
  assert.doesNotMatch(page, /(?<!has-)\bclear\b/);
  assert.doesNotMatch(page, /\bambered\b/);
  assert.doesNotMatch(page, /\bbynamed\b/);
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

test("README anti-clone encodes the imprimatur thesis", () => {
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /Skip all approvals/);
  assert.match(readme, /Automatically approve/);
  assert.match(readme, /#88997/);
  assert.match(readme, /#89967/);
  assert.match(readme, /#91883/);
  assert.match(readme, /How to score/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/imprimatur\//);
  assert.match(readme, /Score refused or admit imprinted/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /NOT #88997/);
  assert.match(readme, /NOT #89967/);
  assert.match(readme, /NOT #91883/);
  assert.match(readme, /NOT Byname/);
  assert.match(hookReadme, /waived/);
  assert.match(hookReadme, /refused/);
  assert.match(hookReadme, /imprinted/);
  assert.match(dataReadme, /waived/);
  assert.match(dataReadme, /refused/);
  assert.match(dataReadme, /imprinted/);
});
