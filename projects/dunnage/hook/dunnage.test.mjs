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
  seedBerthed,
  seedEchoed,
  seedAdvanced,
  fingerprint,
  signals,
  berthedSignal,
  echoedSignal,
  advancedSignal,
  samePageSignal,
  hasMoreLiedSignal,
  cursorIgnoredSignal,
  twentyCapSignal,
  pagesIncompleteSignal,
  listVsListRunsSignal,
  cribAdvanced,
  sameFirstPage,
  cursorWasIgnored,
  HOLD,
  ALARM,
  MEASURED,
  CHIPS,
  VERDICTS,
  COUSINS,
  PAGE_LEDGER,
  IDLE_WORD,
  SEEDED_WORD,
  ADMIT_WORD
} from "./dunnage.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const page = readFileSync(join(root, "index.html"), "utf8");
const readme = readFileSync(join(root, "README.md"), "utf8");
const hookReadme = readFileSync(join(root, "hook", "README.md"), "utf8");
const dataReadme = readFileSync(join(root, "data", "README.md"), "utf8");

test("primary 92746 fixture scores echoed", () => {
  const primary = JSON.parse(readFileSync(join(root, "data", "92746.json"), "utf8"));
  const out = decide(primary);
  assert.equal(out.verdict, "echoed");
  assert.equal(out.echoed, true);
  assert.ok(out.chips.includes("echoed"));
  assert.ok(ALARM.has(out.verdict));
});

test("empty / idle probe is berthed", () => {
  const out = decide({});
  assert.equal(out.verdict, "berthed");
  assert.equal(out.berthed, true);
  assert.equal(out.echoed, false);
  assert.ok(HOLD.has("berthed"));
  assert.equal(IDLE_WORD, "berthed");
});

test("berthed fixture is hold", () => {
  const idle = JSON.parse(readFileSync(join(root, "data", "berthed.json"), "utf8"));
  const out = decide(idle);
  assert.equal(out.verdict, "berthed");
  assert.equal(out.berthed, true);
  assert.ok(HOLD.has(out.verdict));
});

test("seeded echoed scores echoed", () => {
  const out = decide(seedEchoed());
  assert.equal(out.verdict, "echoed");
  assert.equal(out.echoed, true);
  assert.ok(out.chips.includes("echoed"));
  assert.ok(out.chips.includes("same-page"));
  assert.ok(out.chips.includes("cursor-ignored"));
  assert.ok(ALARM.has(out.verdict));
});

test("advanced seed is a hold", () => {
  const out = decide(seedAdvanced());
  assert.equal(out.verdict, "advanced");
  assert.equal(out.advanced, true);
  assert.equal(out.echoed, false);
  assert.ok(HOLD.has(out.verdict));
  assert.equal(SEEDED_WORD, "echoed");
  assert.equal(ADMIT_WORD, "advanced");
});

test("berthed seed is idle hold", () => {
  const out = decide(seedBerthed());
  assert.equal(out.verdict, "berthed");
  assert.equal(out.berthed, true);
  assert.ok(HOLD.has("berthed"));
});

test("same-page chip", () => {
  const out = decide({ seed: "same-page", samePage: true });
  assert.equal(out.verdict, "same-page");
  assert.equal(out.echoed, true);
  assert.match(out.reasons.join(" "), /same first page/);
  assert.match(out.reasons.join(" "), /397 KB/);
});

test("has-more-lied chip", () => {
  const out = decide({ seed: "has-more-lied", hasMoreLied: true });
  assert.equal(out.verdict, "has-more-lied");
  assert.match(out.reasons.join(" "), /has_more/);
  assert.match(out.reasons.join(" "), /next_cursor/);
});

test("cursor vs twenty-cap contrast", () => {
  const cursor = decide({ seed: "cursor-ignored", cursorIgnored: true });
  const cap = decide({ seed: "twenty-cap", twentyCap: true });
  assert.equal(cursor.verdict, "cursor-ignored");
  assert.equal(cap.verdict, "twenty-cap");
  assert.equal(PAGE_LEDGER.find((c) => c.id === "page1").tally, "20 routines");
  assert.equal(PAGE_LEDGER.find((c) => c.id === "reissued").tally, "same 20 · ~397 KB");
});

test("cursor-ignored chip", () => {
  const out = decide({ seed: "cursor-ignored", cursorIgnored: true });
  assert.equal(out.verdict, "cursor-ignored");
  assert.match(out.reasons.join(" "), /cursor argument/);
  assert.match(out.reasons.join(" "), /action=list/);
});

test("twenty-cap chip", () => {
  const out = decide({ seed: "twenty-cap", twentyCap: true });
  assert.equal(out.verdict, "twenty-cap");
  assert.match(out.reasons.join(" "), /20 routines/);
  assert.match(out.reasons.join(" "), /21\+/);
});

test("pages-incomplete chip", () => {
  const out = decide({ seed: "pages-incomplete", pagesIncomplete: true });
  assert.equal(out.verdict, "pages-incomplete");
  assert.match(out.reasons.join(" "), /pages_complete: false/);
  assert.match(out.reasons.join(" "), /cc-usage-insights/);
});

test("list-vs-list-runs chip", () => {
  const out = decide({ seed: "list-vs-list-runs", listVsListRuns: true });
  assert.equal(out.verdict, "list-vs-list-runs");
  assert.match(out.reasons.join(" "), /list_runs/);
  assert.match(out.reasons.join(" "), /get_run_log/);
});

test("cousins cite-only closed MCP pages", () => {
  const out = decide({
    seed: "cousins",
    cousinsCiteOnly: COUSINS
  });
  assert.equal(out.verdict, "cousins");
  assert.match(out.reasons.join(" "), /24785/);
  assert.match(out.reasons.join(" "), /39586/);
  assert.match(out.reasons.join(" "), /92746/);
  assert.equal(COUSINS.length, 2);
  assert.equal(COUSINS[0].state, "closed");
  assert.equal(COUSINS[1].state, "closed");
});

test("has-clear-repro chip from labels", () => {
  const out = decide({ seed: "has-clear-repro", hasClearRepro: true });
  assert.equal(out.verdict, "has-clear-repro");
  assert.match(out.reasons.join(" "), /has-clear-repro/);
  assert.match(out.reasons.join(" "), /has repro/);
});

test("analyze / score / handle / seeds / scoreFields", () => {
  const idle = analyze({});
  assert.equal(idle.verdict, "berthed");
  assert.equal(score(seedAdvanced()).verdict, "advanced");
  assert.equal(handle('{"seed":"echoed","echoed":true}').verdict, "echoed");
  assert.equal(handle({ seed: "advanced", advanced: true }).verdict, "advanced");
  const bag = seeds();
  assert.equal(decide(bag.berthed).verdict, "berthed");
  assert.equal(decide(bag.echoed).verdict, "echoed");
  assert.equal(decide(bag.advanced).verdict, "advanced");
  assert.equal(scoreFields(seedEchoed()).echoed, true);
});

test("fingerprint and signals detect dunnage facts", () => {
  assert.equal(
    berthedSignal("idle crib is berthed; pin idle berthed; has_more false; cursor advances to a distinct"),
    true
  );
  assert.equal(
    echoedSignal("page echoed; identical first page; same first page; cursor ignored; identical"),
    true
  );
  assert.equal(advancedSignal("crib already advanced; distinct page 2; stops advertising has_more"), true);
  assert.equal(samePageSignal("same-page exactly the same first page same ids created_at"), true);
  assert.equal(hasMoreLiedSignal("has-more-lied has_more: true next_cursor ignored"), true);
  assert.equal(cursorIgnoredSignal("cursor-ignored ignores the cursor cursor argument is not applied"), true);
  assert.equal(twentyCapSignal("twenty-cap 20 routines routines 21+ capped at 20"), true);
  assert.equal(pagesIncompleteSignal("pages-incomplete pages_complete: false partial result"), true);
  assert.equal(listVsListRunsSignal("list-vs-list-runs list_runs get_run_log intentionally not pageable"), true);
  const hits = signals(seedEchoed());
  assert.equal(hits.echoed || hits.samePage || hits.cursorIgnored, true);
  const print = fingerprint(seedEchoed());
  assert.equal(print.samePage, true);
  assert.equal(print.echoedHit, true);
  assert.equal(print.pageReissued, true);
});

test("fingerprint scores advanced crib path", () => {
  const print = fingerprint(seedAdvanced());
  assert.equal(print.advancedClean, true);
  assert.equal(print.echoedHit, false);
  const out = decide({ ...seedAdvanced(), seed: "advanced" });
  assert.equal(out.advanced, true);
  assert.equal(out.verdict, "advanced");
  assert.equal(cribAdvanced(seedAdvanced()), true);
  assert.equal(cribAdvanced(seedEchoed()), false);
});

test("classify idle vs hold flags", () => {
  const alarm = classify(seedEchoed());
  assert.equal(alarm.echoed, true);
  const hold = classify(seedAdvanced());
  assert.equal(hold.advanced, true);
  const idle = classify(seedBerthed());
  assert.equal(idle.berthed, true);
});

test("page helpers encode same first page + ignored cursor", () => {
  assert.equal(sameFirstPage(seedEchoed()), true);
  assert.equal(cursorWasIgnored(seedEchoed()), true);
  assert.equal(sameFirstPage(seedBerthed()), false);
  assert.equal(cursorWasIgnored(seedBerthed()), false);
  assert.equal(sameFirstPage({ sameFirstPage: true }), true);
  assert.equal(cursorWasIgnored({ cursorIgnored: true }), true);
});

test("page ledger encodes the issue split", () => {
  assert.ok(PAGE_LEDGER.some((row) => row.id === "page1" && /20/.test(row.tally)));
  assert.ok(PAGE_LEDGER.some((row) => row.id === "reissued" && /397/.test(row.tally)));
  assert.ok(PAGE_LEDGER.some((row) => row.id === "advanced" && /page 2/.test(row.note)));
  assert.ok(PAGE_LEDGER.length === 3);
});

test("measured facts from #92746", () => {
  assert.equal(MEASURED.issue, 92746);
  assert.equal(MEASURED.state, "open");
  assert.deepEqual(MEASURED.labels, ["bug", "has repro", "platform:wsl", "area:routines"]);
  assert.equal(MEASURED.filed, "2026-09-07T23:00:53Z");
  assert.equal(MEASURED.claude, "Claude Code CLI");
  assert.match(MEASURED.os, /WSL2/);
  assert.match(MEASURED.os, /Linux 6\.18/);
  assert.match(MEASURED.session, /Fable 5\.1/);
  assert.equal(MEASURED.pageSize, 20);
  assert.equal(MEASURED.hasMore, true);
  assert.equal(MEASURED.cursorIgnored, true);
  assert.equal(MEASURED.httpStatus, 200);
  assert.equal(MEASURED.observedByteSize, "~397 KB");
  assert.equal(MEASURED.pagesComplete, false);
  assert.deepEqual(MEASURED.cursorDocumentedFor, ["list_runs", "get_run_log"]);
  assert.match(MEASURED.skill, /cc-usage-insights/);
  assert.equal(IDLE_WORD, "berthed");
  assert.equal(SEEDED_WORD, "echoed");
  assert.equal(ADMIT_WORD, "advanced");
});

test("HOLD is berthed/advanced; ALARM is echoed family", () => {
  assert.ok(HOLD.has("berthed"));
  assert.ok(HOLD.has("advanced"));
  assert.equal(ALARM.has("berthed"), false);
  assert.equal(ALARM.has("advanced"), false);
  for (const chip of [
    "echoed",
    "same-page",
    "has-more-lied",
    "cursor-ignored",
    "twenty-cap",
    "pages-incomplete",
    "list-vs-list-runs",
    "cousins",
    "has-clear-repro"
  ]) {
    assert.ok(ALARM.has(chip), chip);
  }
  assert.deepEqual(CHIPS, VERDICTS);
  assert.deepEqual(VERDICTS, [
    "berthed",
    "echoed",
    "advanced",
    "same-page",
    "has-more-lied",
    "cursor-ignored",
    "twenty-cap",
    "pages-incomplete",
    "list-vs-list-runs",
    "has-clear-repro",
    "cousins"
  ]);
});

test("cousins table cites closed MCP nextCursor issues", () => {
  assert.equal(COUSINS.length, 2);
  assert.ok(COUSINS.some((c) => c.id === 24785 && c.state === "closed"));
  assert.ok(COUSINS.some((c) => c.id === 39586 && c.state === "closed"));
});

test("fixtures encode issue facts and score their seeds", () => {
  const files = [
    "berthed.json",
    "echoed.json",
    "advanced.json",
    "92746.json",
    "same-page.json",
    "has-more-lied.json",
    "cursor-ignored.json",
    "twenty-cap.json",
    "pages-incomplete.json",
    "list-vs-list-runs.json",
    "cousins.json",
    "fixtures.json",
    "has-clear-repro.json"
  ];
  for (const name of files) {
    const raw = readFileSync(join(root, "data", name), "utf8");
    assert.match(raw, /92746|dunnage|berthed|echoed|advanced/i);
    if (name !== "fixtures.json") {
      const fixture = JSON.parse(raw);
      const out = decide(fixture);
      assert.ok(VERDICTS.includes(out.verdict), `${name} → ${out.verdict}`);
    }
  }
  const index = JSON.parse(readFileSync(join(root, "data", "fixtures.json"), "utf8"));
  assert.equal(index.narrativeNotFixture.idle, "berthed");
  assert.equal(index.narrativeNotFixture.seeded, "echoed");
  assert.equal(index.narrativeNotFixture.noLiveSessions, true);
  assert.equal(index.narrativeNotFixture.noPayloads, true);
  assert.equal(index.narrativeNotFixture.noSecrets, true);
  assert.ok(index.narrativeNotFixture.labels.includes("has repro"));
  assert.ok(index.narrativeNotFixture.labels.includes("area:routines"));
  assert.ok(index.narrativeNotFixture.labels.includes("platform:wsl"));
  const listed = readdirSync(join(root, "data"));
  assert.ok(listed.includes("README.md"));
});

test("living page is a stevedore dunnage crib, not a clone", () => {
  assert.match(page, /Bitter/);
  assert.match(page, /Plus Jakarta Sans/);
  assert.match(page, /Fragment Mono/);
  assert.doesNotMatch(page, /DM Serif Display/);
  assert.doesNotMatch(page, /Commissioner/);
  assert.doesNotMatch(page, /Azeret Mono/);
  assert.doesNotMatch(page, /Instrument Serif/);
  assert.doesNotMatch(page, /Figtree/);
  assert.doesNotMatch(page, /JetBrains Mono/);
  assert.doesNotMatch(page, /Playfair Display/);
  assert.doesNotMatch(page, /DM Sans/);
  assert.doesNotMatch(page, /Fira Code/);
  assert.doesNotMatch(page, /Newsreader/);
  assert.doesNotMatch(page, /Sora/);
  assert.doesNotMatch(page, /Ibarra Real Nova/);
  assert.doesNotMatch(page, /Geist Mono/);
  assert.doesNotMatch(page, /Cardo/);
  assert.doesNotMatch(page, /Public Sans/);
  assert.doesNotMatch(page, /Young Serif/);
  assert.doesNotMatch(page, /Karla/);
  assert.doesNotMatch(page, /Bodoni Moda/);
  assert.doesNotMatch(page, /Nunito Sans/);
  assert.doesNotMatch(page, /Oswald/);
  assert.doesNotMatch(page, /Source Sans 3/);
  assert.doesNotMatch(page, /Big Shoulders Display/);
  assert.doesNotMatch(page, /Roboto Mono/);
  assert.match(page, /echoed/);
  assert.match(page, /advanced/);
  assert.match(page, /\bberthed\b/);
  assert.match(page, /#92746/);
  assert.match(page, /Dunnage/);
  assert.match(page, /embed/);
  assert.match(page, /\?embed=1/);
  assert.match(page, /11:50 \/ hermes catalog #217 \/ #92746/);
  assert.match(page, /Score echoed/);
  assert.match(page, /Admit advanced/);
  assert.match(page, /Pin idle berthed/);
  assert.match(page, /Reset to berthed/);
  assert.match(page, /RemoteTrigger/);
  assert.match(page, /action=list/);
  assert.match(page, /has_more/);
  assert.match(page, /next_cursor/);
  assert.match(page, /dunnage crib/);
  assert.match(page, /crate stencil/);
  assert.match(page, /cousin-not-primary/);
});

test("page stays off neighboring UIs and prior idle words", () => {
  assert.doesNotMatch(page, /letterpress set-off/i);
  assert.doesNotMatch(page, /dampened tympan/i);
  assert.doesNotMatch(page, /locksmith's espagnolette/i);
  assert.doesNotMatch(page, /casement-fastener/i);
  assert.doesNotMatch(page, /censor's imprimatur/i);
  assert.doesNotMatch(page, /nihil-obstat/i);
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
  assert.doesNotMatch(page, /print-shop \/ overstrike/i);
  assert.doesNotMatch(page, /woodworking/i);
  assert.doesNotMatch(page, /millimeter-slider/i);
  assert.doesNotMatch(page, /(?<!has-)\bclear\b/);
  assert.doesNotMatch(page, /\blean\b/);
  assert.doesNotMatch(page, /\bladen\b/);
  assert.doesNotMatch(page, /\bwaived\b/);
  assert.doesNotMatch(page, /\brefused\b/);
  assert.doesNotMatch(page, /\bimprinted\b/);
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
  assert.doesNotMatch(page, /\battentive\b/);
  assert.doesNotMatch(page, /\bdeaf\b/);
  assert.doesNotMatch(page, /\bremounted\b/);
  assert.doesNotMatch(page, /\bshed\b/);
});

test("README anti-clone encodes the dunnage thesis", () => {
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /RemoteTrigger/);
  assert.match(readme, /action=list/);
  assert.match(readme, /How to score/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/dunnage\//);
  assert.match(readme, /Score echoed or admit advanced/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /NOT Setoff/);
  assert.match(readme, /NOT Espagnolette/);
  assert.match(readme, /NOT Imprimatur/);
  assert.match(readme, /NOT Byname/);
  assert.match(hookReadme, /berthed/);
  assert.match(hookReadme, /echoed/);
  assert.match(hookReadme, /advanced/);
  assert.match(dataReadme, /berthed/);
  assert.match(dataReadme, /echoed/);
  assert.match(dataReadme, /advanced/);
});
