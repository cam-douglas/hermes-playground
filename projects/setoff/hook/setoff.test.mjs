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
  seedLean,
  seedLaden,
  seedShed,
  fingerprint,
  signals,
  leanSignal,
  ladenSignal,
  shedSignal,
  memoryAttachedSignal,
  skillListingSignal,
  customAgentUnchangedSignal,
  allowlistResidualSignal,
  tokenTableSignal,
  docsVsMeasuredSignal,
  tympanShed,
  hasMemoryInstructions,
  hasSkillListing,
  HOLD,
  ALARM,
  MEASURED,
  CHIPS,
  VERDICTS,
  COUSINS,
  TOKEN_TABLE,
  SHEETS,
  IDLE_WORD,
  SEEDED_WORD,
  ADMIT_WORD
} from "./setoff.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const page = readFileSync(join(root, "index.html"), "utf8");
const readme = readFileSync(join(root, "README.md"), "utf8");
const hookReadme = readFileSync(join(root, "hook", "README.md"), "utf8");
const dataReadme = readFileSync(join(root, "data", "README.md"), "utf8");

test("primary 92750 fixture scores laden", () => {
  const primary = JSON.parse(readFileSync(join(root, "data", "92750.json"), "utf8"));
  const out = decide(primary);
  assert.equal(out.verdict, "laden");
  assert.equal(out.laden, true);
  assert.ok(out.chips.includes("laden"));
  assert.ok(ALARM.has(out.verdict));
});

test("empty / idle probe is lean", () => {
  const out = decide({});
  assert.equal(out.verdict, "lean");
  assert.equal(out.lean, true);
  assert.equal(out.laden, false);
  assert.ok(HOLD.has("lean"));
  assert.equal(IDLE_WORD, "lean");
});

test("lean fixture is hold", () => {
  const idle = JSON.parse(readFileSync(join(root, "data", "lean.json"), "utf8"));
  const out = decide(idle);
  assert.equal(out.verdict, "lean");
  assert.equal(out.lean, true);
  assert.ok(HOLD.has(out.verdict));
});

test("seeded laden scores laden", () => {
  const out = decide(seedLaden());
  assert.equal(out.verdict, "laden");
  assert.equal(out.laden, true);
  assert.ok(out.chips.includes("laden"));
  assert.ok(out.chips.includes("memory-attached"));
  assert.ok(out.chips.includes("skill-listing"));
  assert.ok(ALARM.has(out.verdict));
});

test("shed seed is a hold", () => {
  const out = decide(seedShed());
  assert.equal(out.verdict, "shed");
  assert.equal(out.shed, true);
  assert.equal(out.laden, false);
  assert.ok(HOLD.has(out.verdict));
  assert.equal(SEEDED_WORD, "laden");
  assert.equal(ADMIT_WORD, "shed");
});

test("lean seed is idle hold", () => {
  const out = decide(seedLean());
  assert.equal(out.verdict, "lean");
  assert.equal(out.lean, true);
  assert.ok(HOLD.has("lean"));
});

test("memory-attached chip", () => {
  const out = decide({ seed: "memory-attached", memoryAttached: true });
  assert.equal(out.verdict, "memory-attached");
  assert.equal(out.laden, true);
  assert.match(out.reasons.join(" "), /MEMORY\.md/);
  assert.match(out.reasons.join(" "), /19,850/);
});

test("skill-listing chip", () => {
  const out = decide({ seed: "skill-listing", skillListing: true });
  assert.equal(out.verdict, "skill-listing");
  assert.match(out.reasons.join(" "), /skill_listing/);
  assert.match(out.reasons.join(" "), /49 skills/);
});

test("custom vs allowlist contrast", () => {
  const custom = decide({ seed: "custom-agent-unchanged", customAgentUnchanged: true });
  const allow = decide({ seed: "allowlist-residual", allowlistResidual: true });
  assert.equal(custom.verdict, "custom-agent-unchanged");
  assert.equal(allow.verdict, "allowlist-residual");
  assert.equal(TOKEN_TABLE.find((c) => c.tokens === 45907).agent, "built-in general-purpose");
  assert.equal(TOKEN_TABLE.find((c) => c.tokens === 27832).tokens, 27832);
  assert.equal(SHEETS.find((c) => c.id === "lean").ink, "none");
  assert.equal(SHEETS.find((c) => c.id === "laden").ink, "oxidized halo");
});

test("custom-agent-unchanged chip", () => {
  const out = decide({ seed: "custom-agent-unchanged", customAgentUnchanged: true });
  assert.equal(out.verdict, "custom-agent-unchanged");
  assert.match(out.reasons.join(" "), /system prompt/);
  assert.match(out.reasons.join(" "), /unchanged/);
});

test("allowlist-residual chip", () => {
  const out = decide({ seed: "allowlist-residual", allowlistResidual: true });
  assert.equal(out.verdict, "allowlist-residual");
  assert.match(out.reasons.join(" "), /27,832/);
  assert.match(out.reasons.join(" "), /~24k/);
});

test("token-table chip", () => {
  const out = decide({ seed: "token-table", tokenTable: true });
  assert.equal(out.verdict, "token-table");
  assert.match(out.reasons.join(" "), /45,907/);
  assert.match(out.reasons.join(" "), /33,244/);
});

test("docs-vs-measured chip", () => {
  const out = decide({ seed: "docs-vs-measured", docsVsMeasured: true });
  assert.equal(out.verdict, "docs-vs-measured");
  assert.match(out.reasons.join(" "), /NOT loaded/);
  assert.match(out.reasons.join(" "), /Measured/);
});

test("cousins cite-only empty", () => {
  const out = decide({
    seed: "cousins",
    cousinsCiteOnly: []
  });
  assert.equal(out.verdict, "cousins");
  assert.match(out.reasons.join(" "), /Prefer none/);
  assert.match(out.reasons.join(" "), /92750/);
  assert.deepEqual(COUSINS, []);
});

test("has-clear-repro chip from labels", () => {
  const out = decide({ seed: "has-clear-repro", hasClearRepro: true });
  assert.equal(out.verdict, "has-clear-repro");
  assert.match(out.reasons.join(" "), /has-clear-repro/);
  assert.match(out.reasons.join(" "), /has repro/);
});

test("analyze / score / handle / seeds / scoreFields", () => {
  const idle = analyze({});
  assert.equal(idle.verdict, "lean");
  assert.equal(score(seedShed()).verdict, "shed");
  assert.equal(handle('{"seed":"laden","laden":true}').verdict, "laden");
  assert.equal(handle({ seed: "shed", shed: true }).verdict, "shed");
  const bag = seeds();
  assert.equal(decide(bag.lean).verdict, "lean");
  assert.equal(decide(bag.laden).verdict, "laden");
  assert.equal(decide(bag.shed).verdict, "shed");
  assert.equal(scoreFields(seedLaden()).laden, true);
});

test("fingerprint and signals detect setoff facts", () => {
  assert.equal(
    leanSignal("idle tympan is lean; pin idle lean; no MEMORY.md; no skill_listing"),
    true
  );
  assert.equal(
    ladenSignal("facing sheet laden; MEMORY.md and skill_listing; laden; first request"),
    true
  );
  assert.equal(shedSignal("tympan already shed; hypothetical strip; halo wiped"), true);
  assert.equal(memoryAttachedSignal("memory-attached MEMORY.md as instructions attachment"), true);
  assert.equal(skillListingSignal("skill-listing skill_listing pre-populated listing"), true);
  assert.equal(
    customAgentUnchangedSignal("custom-agent-unchanged custom agent arrive unchanged .claude/agents"),
    true
  );
  assert.equal(allowlistResidualSignal("allowlist-residual 8-tool allowlist 27,832 residual ~24k"), true);
  assert.equal(tokenTableSignal("token-table 45,907 33,244 27,832"), true);
  assert.equal(docsVsMeasuredSignal("docs-vs-measured contrary to the docs docs say"), true);
  const hits = signals(seedLaden());
  assert.equal(hits.laden || hits.memoryAttached || hits.skillListing, true);
  const print = fingerprint(seedLaden());
  assert.equal(print.memoryAttached, true);
  assert.equal(print.ladenHit, true);
  assert.equal(print.bothAttachments, true);
});

test("fingerprint scores shed clean tympan path", () => {
  const print = fingerprint(seedShed());
  assert.equal(print.shedClean, true);
  assert.equal(print.ladenHit, false);
  const out = decide({ ...seedShed(), seed: "shed" });
  assert.equal(out.shed, true);
  assert.equal(out.verdict, "shed");
  assert.equal(tympanShed(seedShed()), true);
  assert.equal(tympanShed(seedLaden()), false);
});

test("classify idle vs hold flags", () => {
  const alarm = classify(seedLaden());
  assert.equal(alarm.laden, true);
  const hold = classify(seedShed());
  assert.equal(hold.shed, true);
  const idle = classify(seedLean());
  assert.equal(idle.lean, true);
});

test("attachment helpers encode memory + skill listing", () => {
  assert.equal(hasMemoryInstructions(seedLaden()), true);
  assert.equal(hasSkillListing(seedLaden()), true);
  assert.equal(hasMemoryInstructions(seedLean()), false);
  assert.equal(hasSkillListing(seedLean()), false);
  assert.equal(
    hasMemoryInstructions({
      attachments: ["instructions"],
      memoryChars: 19850,
      memoryPath: "MEMORY.md"
    }),
    true
  );
  assert.equal(hasSkillListing({ attachments: [{ type: "skill_listing" }] }), true);
});

test("token table and sheets encode the issue split", () => {
  assert.ok(TOKEN_TABLE.some((row) => row.tokens === 45907));
  assert.ok(TOKEN_TABLE.some((row) => row.tokens === 33244));
  assert.ok(TOKEN_TABLE.some((row) => row.tokens === 27832));
  assert.ok(SHEETS.length === 3);
  assert.ok(SHEETS.some((row) => row.id === "lean" && row.ink === "none"));
  assert.ok(SHEETS.some((row) => row.id === "laden" && /halo/.test(row.ink)));
  assert.ok(SHEETS.some((row) => row.id === "shed" && /wiped/.test(row.ink)));
});

test("measured facts from #92750", () => {
  assert.equal(MEASURED.issue, 92750);
  assert.equal(MEASURED.state, "open");
  assert.deepEqual(MEASURED.labels, ["bug", "has repro", "platform:macos", "area:agents"]);
  assert.equal(MEASURED.filed, "2026-09-07T23:38:05Z");
  assert.equal(MEASURED.claude, "Claude Code 2.1.263 (also 2.1.261 / 2.1.258)");
  assert.match(MEASURED.os, /macOS 15/);
  assert.match(MEASURED.plan, /Claude Max/);
  assert.deepEqual(MEASURED.models, ["claude-fable-5-1", "claude-opus-5"]);
  assert.equal(MEASURED.memoryChars, 19850);
  assert.equal(MEASURED.skillCount, 49);
  assert.equal(MEASURED.tokens.generalPurpose, 45907);
  assert.equal(MEASURED.tokens.customNoTools, 33244);
  assert.equal(MEASURED.tokens.customAllowlist8, 27832);
  assert.match(MEASURED.docsExpected[0], /auto memory isn't loaded/);
  assert.match(MEASURED.docsExpected[1], /pre-populated listing/);
  assert.equal(IDLE_WORD, "lean");
  assert.equal(SEEDED_WORD, "laden");
  assert.equal(ADMIT_WORD, "shed");
});

test("HOLD is lean/shed; ALARM is laden family", () => {
  assert.ok(HOLD.has("lean"));
  assert.ok(HOLD.has("shed"));
  assert.equal(ALARM.has("lean"), false);
  assert.equal(ALARM.has("shed"), false);
  for (const chip of [
    "laden",
    "memory-attached",
    "skill-listing",
    "custom-agent-unchanged",
    "allowlist-residual",
    "token-table",
    "docs-vs-measured",
    "cousins",
    "has-clear-repro"
  ]) {
    assert.ok(ALARM.has(chip), chip);
  }
  assert.deepEqual(CHIPS, VERDICTS);
  assert.deepEqual(VERDICTS, [
    "lean",
    "laden",
    "shed",
    "memory-attached",
    "skill-listing",
    "custom-agent-unchanged",
    "allowlist-residual",
    "token-table",
    "docs-vs-measured",
    "has-clear-repro",
    "cousins"
  ]);
});

test("cousins table prefers none", () => {
  assert.deepEqual(COUSINS, []);
});

test("fixtures encode issue facts and score their seeds", () => {
  const files = [
    "lean.json",
    "laden.json",
    "shed.json",
    "92750.json",
    "memory-attached.json",
    "skill-listing.json",
    "custom-agent-unchanged.json",
    "allowlist-residual.json",
    "token-table.json",
    "docs-vs-measured.json",
    "cousins.json",
    "fixtures.json",
    "has-clear-repro.json"
  ];
  for (const name of files) {
    const raw = readFileSync(join(root, "data", name), "utf8");
    assert.match(raw, /92750|setoff|lean|laden|shed/i);
    if (name !== "fixtures.json") {
      const fixture = JSON.parse(raw);
      const out = decide(fixture);
      assert.ok(VERDICTS.includes(out.verdict), `${name} → ${out.verdict}`);
    }
  }
  const index = JSON.parse(readFileSync(join(root, "data", "fixtures.json"), "utf8"));
  assert.equal(index.narrativeNotFixture.idle, "lean");
  assert.equal(index.narrativeNotFixture.seeded, "laden");
  assert.equal(index.narrativeNotFixture.noLiveSessions, true);
  assert.equal(index.narrativeNotFixture.noPayloads, true);
  assert.equal(index.narrativeNotFixture.noSecrets, true);
  assert.ok(index.narrativeNotFixture.labels.includes("has repro"));
  assert.ok(index.narrativeNotFixture.labels.includes("area:agents"));
  assert.ok(index.narrativeNotFixture.labels.includes("platform:macos"));
  const listed = readdirSync(join(root, "data"));
  assert.ok(listed.includes("README.md"));
});

test("living page is a letterpress set-off bench, not a clone", () => {
  assert.match(page, /DM Serif Display/);
  assert.match(page, /Commissioner/);
  assert.match(page, /Azeret Mono/);
  assert.doesNotMatch(page, /Instrument Serif/);
  assert.doesNotMatch(page, /Figtree/);
  assert.doesNotMatch(page, /JetBrains Mono/);
  assert.doesNotMatch(page, /Playfair Display/);
  assert.doesNotMatch(page, /DM Sans/);
  assert.doesNotMatch(page, /Fira Code/);
  assert.doesNotMatch(page, /Newsreader/);
  assert.doesNotMatch(page, /Sora/);
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
  assert.doesNotMatch(page, /Big Shoulders Display/);
  assert.doesNotMatch(page, /Roboto Mono/);
  assert.match(page, /laden/);
  assert.match(page, /shed/);
  assert.match(page, /\blean\b/);
  assert.match(page, /#92750/);
  assert.match(page, /Setoff/);
  assert.match(page, /embed/);
  assert.match(page, /\?embed=1/);
  assert.match(page, /10:50 \/ hermes catalog #216 \/ #92750/);
  assert.match(page, /Score laden/);
  assert.match(page, /Admit shed/);
  assert.match(page, /Pin idle lean/);
  assert.match(page, /Reset to lean/);
  assert.match(page, /MEMORY\.md/);
  assert.match(page, /skill_listing/);
  assert.match(page, /tympan/);
  assert.match(page, /set-off/);
  assert.match(page, /cousin-not-primary/);
});

test("page stays off neighboring UIs and prior idle words", () => {
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
});

test("README anti-clone encodes the setoff thesis", () => {
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /MEMORY\.md/);
  assert.match(readme, /skill_listing/);
  assert.match(readme, /How to score/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/setoff\//);
  assert.match(readme, /Score laden or admit shed/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /NOT Espagnolette/);
  assert.match(readme, /NOT Imprimatur/);
  assert.match(readme, /NOT Byname/);
  assert.match(hookReadme, /lean/);
  assert.match(hookReadme, /laden/);
  assert.match(hookReadme, /shed/);
  assert.match(dataReadme, /lean/);
  assert.match(dataReadme, /laden/);
  assert.match(dataReadme, /shed/);
});
