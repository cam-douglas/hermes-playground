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
  seedSlipped,
  seedSprung,
  fingerprint,
  signals,
  slippedSignal,
  sprungSignal,
  settingsExit2Signal,
  pluginExit2InteractiveSignal,
  pluginExit2PrintSignal,
  pluginJsonDenySignal,
  matcherGeneralSignal,
  standaloneLogicSignal,
  cacheIdenticalSignal,
  threeAxisSignal,
  springeSprung,
  cellEnforced,
  HOLD,
  ALARM,
  MEASURED,
  CHIPS,
  VERDICTS,
  COUSINS,
  MATRIX,
  SNARES,
  IDLE_WORD,
  SEEDED_WORD
} from "./springe.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const page = readFileSync(join(root, "index.html"), "utf8");
const readme = readFileSync(join(root, "README.md"), "utf8");
const hookReadme = readFileSync(join(root, "hook", "README.md"), "utf8");
const dataReadme = readFileSync(join(root, "data", "README.md"), "utf8");

test("primary 92675 fixture scores slipped", () => {
  const primary = JSON.parse(readFileSync(join(root, "data", "92675.json"), "utf8"));
  const out = decide(primary);
  assert.equal(out.verdict, "slipped");
  assert.equal(out.slipped, true);
  assert.ok(out.chips.includes("slipped"));
});

test("empty / idle probe is slipped", () => {
  const out = decide({});
  assert.equal(out.verdict, "slipped");
  assert.equal(out.slipped, true);
  assert.equal(out.sprung, false);
  assert.ok(ALARM.has("slipped"));
  assert.equal(IDLE_WORD, "slipped");
});

test("seeded slipped scores slipped", () => {
  const out = decide(seedSlipped());
  assert.equal(out.verdict, "slipped");
  assert.equal(out.slipped, true);
  assert.ok(out.chips.includes("slipped"));
  assert.ok(out.chips.includes("plugin-exit2-interactive-slip"));
  assert.ok(out.chips.includes("plugin-json-deny-both-modes-slip"));
});

test("sprung seed is a hold", () => {
  const out = decide(seedSprung());
  assert.equal(out.verdict, "sprung");
  assert.equal(out.sprung, true);
  assert.equal(out.slipped, false);
  assert.ok(HOLD.has(out.verdict));
  assert.equal(SEEDED_WORD, "sprung");
});

test("settings-exit2-blocks chip", () => {
  const out = decide({ seed: "settings-exit2-blocks", settingsExit2Blocks: true });
  assert.equal(out.verdict, "settings-exit2-blocks");
  assert.equal(out.slipped, true);
  assert.match(out.reasons.join(" "), /deploy-guard/);
  assert.match(out.reasons.join(" "), /settings\.json/);
});

test("plugin-exit2-interactive-slip chip", () => {
  const out = decide({
    seed: "plugin-exit2-interactive-slip",
    pluginExit2InteractiveSlip: true
  });
  assert.equal(out.verdict, "plugin-exit2-interactive-slip");
  assert.ok(out.chips.includes("plugin-exit2-interactive-slip"));
  assert.match(out.reasons.join(" "), /block-no-verify/);
  assert.match(out.reasons.join(" "), /interactive/);
});

test("plugin-exit2-print-blocks chip", () => {
  const out = decide({ seed: "plugin-exit2-print-blocks", pluginExit2PrintBlocks: true });
  assert.equal(out.verdict, "plugin-exit2-print-blocks");
  assert.match(out.reasons.join(" "), /print mode/);
  assert.match(out.reasons.join(" "), /exit-2/);
});

test("plugin-json-deny-both-modes-slip chip", () => {
  const out = decide({
    seed: "plugin-json-deny-both-modes-slip",
    pluginJsonDenyBothModesSlip: true
  });
  assert.equal(out.verdict, "plugin-json-deny-both-modes-slip");
  assert.match(out.reasons.join(" "), /permissionDecision/);
  assert.match(out.reasons.join(" "), /gateguard-fact-force/);
});

test("matcher-general-not-bash-only chip", () => {
  const out = decide({
    seed: "matcher-general-not-bash-only",
    matcherGeneralNotBashOnly: true
  });
  assert.equal(out.verdict, "matcher-general-not-bash-only");
  assert.match(out.reasons.join(" "), /config-protection/);
  assert.match(out.reasons.join(" "), /Edit\|Write/);
});

test("hook-logic-correct-standalone chip", () => {
  const out = decide({
    seed: "hook-logic-correct-standalone",
    hookLogicCorrectStandalone: true
  });
  assert.equal(out.verdict, "hook-logic-correct-standalone");
  assert.match(out.reasons.join(" "), /standalone/);
  assert.match(out.reasons.join(" "), /bootstrap/);
});

test("cache-byte-identical chip", () => {
  const out = decide({ seed: "cache-byte-identical", cacheByteIdentical: true });
  assert.equal(out.verdict, "cache-byte-identical");
  assert.match(out.reasons.join(" "), /byte-identical/);
  assert.match(out.reasons.join(" "), /ecc\/ecc\/2\.2\.1/);
});

test("three-axis-isolation chip", () => {
  const out = decide({ seed: "three-axis-isolation", threeAxisIsolation: true });
  assert.equal(out.verdict, "three-axis-isolation");
  assert.match(out.reasons.join(" "), /source/);
  assert.match(out.reasons.join(" "), /protocol/);
  assert.match(out.reasons.join(" "), /mode/);
});

test("cousins cite-only", () => {
  const out = decide({ seed: "cousins", cousinsCiteOnly: [10875, 52822, 31250] });
  assert.equal(out.verdict, "cousins");
  assert.match(out.reasons.join(" "), /#10875/);
  assert.match(out.reasons.join(" "), /#52822/);
  assert.match(out.reasons.join(" "), /#31250/);
  assert.match(out.reasons.join(" "), /Waybill/);
  assert.match(out.reasons.join(" "), /Snatch/);
});

test("has-clear-repro chip from labels", () => {
  const out = decide({ seed: "has-clear-repro", hasClearRepro: true });
  assert.equal(out.verdict, "has-clear-repro");
  assert.match(out.reasons.join(" "), /has-clear-repro/);
  assert.match(out.reasons.join(" "), /has repro/);
});

test("analyze / score / handle / seeds / scoreFields", () => {
  const idle = analyze({});
  assert.equal(idle.verdict, "slipped");
  assert.equal(score(seedSprung()).verdict, "sprung");
  assert.equal(handle('{"seed":"slipped","slipped":true}').verdict, "slipped");
  assert.equal(handle({ seed: "sprung", sprung: true }).verdict, "sprung");
  const bag = seeds();
  assert.equal(decide(bag.slipped).verdict, "slipped");
  assert.equal(decide(bag.sprung).verdict, "sprung");
  assert.equal(scoreFields(seedSlipped()).slipped, true);
});

test("fingerprint and signals detect springe facts", () => {
  assert.equal(
    slippedSignal("ALARM: springe slipped; silently no-op; does not block; not enforced"),
    true
  );
  assert.equal(sprungSignal("deny correctly enforced; enforced identically; noose taut; sprung"), true);
  assert.equal(settingsExit2Signal("settings-exit2-blocks deploy-guard settings.json-declared"), true);
  assert.equal(
    pluginExit2InteractiveSignal("plugin-exit2-interactive-slip block-no-verify interactive session did not block"),
    true
  );
  assert.equal(pluginExit2PrintSignal("plugin-exit2-print-blocks print mode blocked claude -p blocked"), true);
  assert.equal(
    pluginJsonDenySignal('plugin-json-deny-both-modes-slip permissionDecision:"deny" gateguard-fact-force'),
    true
  );
  assert.equal(
    matcherGeneralSignal("matcher-general-not-bash-only config-protection Edit|Write"),
    true
  );
  assert.equal(
    standaloneLogicSignal("hook-logic-correct-standalone standalone dispatcher pipeline plugin-hook-bootstrap"),
    true
  );
  assert.equal(cacheIdenticalSignal("cache-byte-identical byte-identical plugins/cache/ecc"), true);
  assert.equal(threeAxisSignal("three-axis-isolation source×protocol×mode three independent axes"), true);
  const hits = signals(seedSlipped());
  assert.equal(hits.slipped || hits.pluginExit2Interactive || hits.pluginJsonDeny, true);
  const print = fingerprint(seedSlipped());
  assert.equal(print.pluginExit2Interactive, true);
  assert.equal(print.slippedHit, true);
});

test("fingerprint scores sprung clean noose-taut path", () => {
  const print = fingerprint(seedSprung());
  assert.equal(print.sprungClean, true);
  assert.equal(print.slippedHit, false);
  const out = decide({ ...seedSprung(), seed: "sprung" });
  assert.equal(out.sprung, true);
  assert.equal(out.verdict, "sprung");
  assert.equal(springeSprung(seedSprung()), true);
  assert.equal(springeSprung(seedSlipped()), false);
});

test("classify idle vs hold flags", () => {
  const idle = classify(seedSlipped());
  assert.equal(idle.slipped, true);
  const hold = classify(seedSprung());
  assert.equal(hold.sprung, true);
});

test("cellEnforced encodes the three-axis matrix", () => {
  assert.equal(cellEnforced("settings.json", "exit-2", "interactive"), true);
  assert.equal(cellEnforced("settings.json", "exit-2", "print"), true);
  assert.equal(cellEnforced("plugin-native", "exit-2", "interactive"), false);
  assert.equal(cellEnforced("plugin-native", "exit-2", "print"), true);
  assert.equal(cellEnforced("plugin-native", "json-deny", "interactive"), false);
  assert.equal(cellEnforced("plugin-native", "json-deny", "print"), false);
  assert.equal(cellEnforced("unknown", "exit-2", "interactive"), null);
});

test("snares are peg / noose / trigger", () => {
  assert.ok(SNARES.length === 3);
  assert.ok(SNARES.some((row) => row.id === "peg" && row.taut === true));
  assert.ok(SNARES.some((row) => row.id === "noose" && row.taut === false));
  assert.ok(SNARES.some((row) => row.id === "trigger" && row.taut === false));
});

test("matrix has three source×protocol rows", () => {
  assert.equal(MATRIX.length, 3);
  assert.equal(MATRIX[0].source, "settings.json");
  assert.equal(MATRIX[0].slip, false);
  assert.equal(MATRIX[1].interactive, "slips");
  assert.equal(MATRIX[1].print, "blocks");
  assert.equal(MATRIX[2].protocol, "json-deny");
  assert.equal(MATRIX[2].print, "slips");
});

test("measured facts from #92675", () => {
  assert.equal(MEASURED.issue, 92675);
  assert.equal(MEASURED.state, "open");
  assert.deepEqual(MEASURED.labels, [
    "bug",
    "has repro",
    "platform:windows",
    "area:hooks",
    "area:plugins",
    "area:permissions"
  ]);
  assert.equal(MEASURED.filed, "2026-09-07T14:23:15Z");
  assert.equal(MEASURED.updated, "2026-09-07T14:24:27Z");
  assert.equal(MEASURED.reporter, "BuildSmarterAI");
  assert.equal(MEASURED.comments, 0);
  assert.equal(MEASURED.os, "Windows 11 (10.0.26200)");
  assert.equal(MEASURED.claudeCodeLive, "2.1.263");
  assert.equal(MEASURED.plugin, "everything-claude-code");
  assert.equal(MEASURED.pluginId, "ecc@ecc");
  assert.equal(MEASURED.pluginVersion, "2.2.1");
  assert.equal(MEASURED.controlHook, "deploy-guard.js");
  assert.equal(MEASURED.pluginExit2Hook, "block-no-verify.js");
  assert.equal(MEASURED.pluginJsonHook, "gateguard-fact-force.js");
  assert.equal(MEASURED.pluginExit2InteractiveBlocked, false);
  assert.equal(MEASURED.pluginExit2PrintBlocked, true);
  assert.equal(MEASURED.pluginJsonInteractiveBlocked, false);
  assert.equal(MEASURED.pluginJsonPrintBlocked, false);
  assert.equal(MEASURED.standaloneDenyJsonCorrect, true);
  assert.equal(MEASURED.cacheByteIdentical, true);
  assert.equal(IDLE_WORD, "slipped");
  assert.equal(SEEDED_WORD, "sprung");
});

test("HOLD is sprung; ALARM is slipped family", () => {
  assert.ok(HOLD.has("sprung"));
  assert.equal(ALARM.has("sprung"), false);
  for (const chip of [
    "slipped",
    "settings-exit2-blocks",
    "plugin-exit2-interactive-slip",
    "plugin-exit2-print-blocks",
    "plugin-json-deny-both-modes-slip",
    "matcher-general-not-bash-only",
    "hook-logic-correct-standalone",
    "cache-byte-identical",
    "three-axis-isolation",
    "cousins",
    "has-clear-repro"
  ]) {
    assert.ok(ALARM.has(chip), chip);
  }
  assert.deepEqual(CHIPS, VERDICTS);
  assert.deepEqual(VERDICTS, [
    "slipped",
    "sprung",
    "settings-exit2-blocks",
    "plugin-exit2-interactive-slip",
    "plugin-exit2-print-blocks",
    "plugin-json-deny-both-modes-slip",
    "matcher-general-not-bash-only",
    "hook-logic-correct-standalone",
    "cache-byte-identical",
    "three-axis-isolation",
    "cousins",
    "has-clear-repro"
  ]);
});

test("cousins table is cite-only 10875 / 52822 / 31250", () => {
  assert.deepEqual(
    COUSINS.map((c) => c.id),
    [10875, 52822, 31250]
  );
  assert.ok(COUSINS.every((c) => c.state === "closed"));
});

test("fixtures encode issue facts and score their seeds", () => {
  const files = [
    "slipped.json",
    "sprung.json",
    "92675.json",
    "settings-exit2-blocks.json",
    "plugin-exit2-interactive-slip.json",
    "plugin-exit2-print-blocks.json",
    "plugin-json-deny-both-modes-slip.json",
    "matcher-general-not-bash-only.json",
    "hook-logic-correct-standalone.json",
    "cache-byte-identical.json",
    "three-axis-isolation.json",
    "cousins.json",
    "fixtures.json",
    "has-clear-repro.json"
  ];
  for (const name of files) {
    const raw = readFileSync(join(root, "data", name), "utf8");
    assert.match(raw, /92675|springe|slipped|sprung/i);
    if (name !== "fixtures.json") {
      const fixture = JSON.parse(raw);
      const out = decide(fixture);
      assert.ok(VERDICTS.includes(out.verdict), `${name} → ${out.verdict}`);
    }
  }
  const index = JSON.parse(readFileSync(join(root, "data", "fixtures.json"), "utf8"));
  assert.equal(index.narrativeNotFixture.idle, "slipped");
  assert.equal(index.narrativeNotFixture.seeded, "sprung");
  assert.equal(index.narrativeNotFixture.noLiveSessions, true);
  assert.equal(index.narrativeNotFixture.noPayloads, true);
  assert.equal(index.narrativeNotFixture.noSecrets, true);
  assert.ok(index.narrativeNotFixture.labels.includes("has repro"));
  assert.ok(index.narrativeNotFixture.labels.includes("area:hooks"));
  assert.ok(index.narrativeNotFixture.labels.includes("area:plugins"));
  const listed = readdirSync(join(root, "data"));
  assert.ok(listed.includes("README.md"));
});

test("living page is a trapper springe desk, not a clone", () => {
  assert.match(page, /Bodoni Moda/);
  assert.match(page, /Nunito Sans/);
  assert.match(page, /IBM Plex Mono/);
  assert.doesNotMatch(page, /Oswald/);
  assert.doesNotMatch(page, /Source Sans 3/);
  assert.doesNotMatch(page, /Newsreader/);
  assert.doesNotMatch(page, /Figtree/);
  assert.doesNotMatch(page, /Fragment Mono/);
  assert.doesNotMatch(page, /Big Shoulders Display/);
  assert.doesNotMatch(page, /Public Sans/);
  assert.doesNotMatch(page, /Roboto Mono/);
  assert.doesNotMatch(page, /Petrona/);
  assert.doesNotMatch(page, /Lexend/);
  assert.doesNotMatch(page, /Azeret Mono/);
  assert.doesNotMatch(page, /Instrument Serif/);
  assert.doesNotMatch(page, /Plus Jakarta Sans/);
  assert.doesNotMatch(page, /Fraunces/);
  assert.doesNotMatch(page, /JetBrains Mono/);
  assert.doesNotMatch(page, /Bitter/);
  assert.doesNotMatch(page, /Manrope/);
  assert.match(page, /slipped/);
  assert.match(page, /sprung/);
  assert.match(page, /#92675/);
  assert.match(page, /Springe/);
  assert.match(page, /embed/);
  assert.match(page, /\?embed=1/);
  assert.match(page, /02:50 \/ hermes catalog #209 \/ #92675/);
  assert.match(page, /Score the springe/);
  assert.match(page, /Pin idle slipped/);
  assert.match(page, /Pin seeded sprung/);
  assert.match(page, /Admit sprung/);
  assert.match(page, /Load fixtures/);
  assert.match(page, /Reset to sprung/);
  assert.match(page, /Tension the wire/);
  assert.match(page, /Spring the noose/);
  assert.match(page, /springe|snare|parchment|bronze|moss|SLIPPED|SPRUNG/i);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /10875/);
  assert.match(page, /52822/);
  assert.match(page, /31250/);
  assert.match(page, /deploy-guard/);
  assert.match(page, /block-no-verify/);
  assert.match(page, /gateguard-fact-force/);
  assert.match(page, /permissionDecision/);
  assert.match(page, /hooks\.json/);
});

test("page stays off neighboring UIs and prior idle words", () => {
  assert.doesNotMatch(page, /snatch-block/i);
  assert.doesNotMatch(page, /openable pulley/i);
  assert.doesNotMatch(page, /freight waybill/i);
  assert.doesNotMatch(page, /pier gangway/i);
  assert.doesNotMatch(page, /phosphor persistence/i);
  assert.doesNotMatch(page, /afterimage test card/i);
  assert.doesNotMatch(page, /limber-hole/i);
  assert.doesNotMatch(page, /bilge well/i);
  assert.doesNotMatch(page, /wheel-chock/i);
  assert.doesNotMatch(page, /oak wedge/i);
  assert.doesNotMatch(page, /deadman's switch/i);
  assert.doesNotMatch(page, /locomotive/i);
  assert.doesNotMatch(page, /glass-plate/i);
  assert.doesNotMatch(page, /brass speakpipe/i);
  assert.doesNotMatch(page, /speaking-tube/i);
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
  assert.doesNotMatch(page, /\bmisrouted\b/);
  assert.doesNotMatch(page, /\baddressed\b/);
  assert.doesNotMatch(page, /\bsevered\b/);
  assert.doesNotMatch(page, /\bremoored\b/);
});

test("README anti-clone encodes the springe thesis", () => {
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /plugin-native/);
  assert.match(readme, /hooks\.json/);
  assert.match(readme, /BuildSmarterAI/);
  assert.match(readme, /#10875/);
  assert.match(readme, /#52822/);
  assert.match(readme, /#31250/);
  assert.match(readme, /How to score/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/springe\//);
  assert.match(readme, /Score slipped or admit sprung/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /NOT Waybill/);
  assert.match(readme, /NOT Snatch/);
  assert.match(hookReadme, /slipped/);
  assert.match(hookReadme, /sprung/);
  assert.match(dataReadme, /slipped/);
  assert.match(dataReadme, /sprung/);
});
