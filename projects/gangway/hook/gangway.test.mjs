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
  seedSevered,
  seedRemoored,
  fingerprint,
  signals,
  severedSignal,
  remooredSignal,
  neverRedialSignal,
  healthySocketSignal,
  reconnectNoopSignal,
  tabGroupOrphanSignal,
  sessionMappingSignal,
  createIfEmptySignal,
  chromeRelaunchSignal,
  gangwayRemoored,
  HOLD,
  ALARM,
  MEASURED,
  CHIPS,
  VERDICTS,
  COUSINS,
  BROWS,
  IDLE_WORD,
  SEEDED_WORD
} from "./gangway.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const page = readFileSync(join(root, "index.html"), "utf8");
const readme = readFileSync(join(root, "README.md"), "utf8");
const hookReadme = readFileSync(join(root, "hook", "README.md"), "utf8");
const dataReadme = readFileSync(join(root, "data", "README.md"), "utf8");

test("primary 92662 fixture scores severed", () => {
  const primary = JSON.parse(readFileSync(join(root, "data", "92662.json"), "utf8"));
  const out = decide(primary);
  assert.equal(out.verdict, "severed");
  assert.equal(out.severed, true);
  assert.ok(out.chips.includes("severed"));
});

test("empty / idle probe is severed", () => {
  const out = decide({});
  assert.equal(out.verdict, "severed");
  assert.equal(out.severed, true);
  assert.equal(out.remoored, false);
  assert.ok(ALARM.has("severed"));
  assert.equal(IDLE_WORD, "severed");
});

test("seeded severed scores severed", () => {
  const out = decide(seedSevered());
  assert.equal(out.verdict, "severed");
  assert.equal(out.severed, true);
  assert.ok(out.chips.includes("severed"));
  assert.ok(out.chips.includes("never-redial"));
  assert.ok(out.chips.includes("healthy-socket-ignored"));
});

test("remoored seed is a hold", () => {
  const out = decide(seedRemoored());
  assert.equal(out.verdict, "remoored");
  assert.equal(out.remoored, true);
  assert.equal(out.severed, false);
  assert.ok(HOLD.has(out.verdict));
  assert.equal(SEEDED_WORD, "remoored");
});

test("never-redial chip", () => {
  const out = decide({ seed: "never-redial", neverRedial: true });
  assert.equal(out.verdict, "never-redial");
  assert.equal(out.severed, true);
  assert.match(out.reasons.join(" "), /100 attempts/);
  assert.match(out.reasons.join(" "), /Will retry on next tool call/);
});

test("healthy-socket-ignored chip", () => {
  const out = decide({ seed: "healthy-socket-ignored", healthySocketIgnored: true });
  assert.equal(out.verdict, "healthy-socket-ignored");
  assert.match(out.reasons.join(" "), /execute_tool/);
  assert.match(out.reasons.join(" "), /chrome-native-host/);
});

test("reconnect-noop chip", () => {
  const out = decide({ seed: "reconnect-noop", reconnectNoop: true });
  assert.equal(out.verdict, "reconnect-noop");
  assert.match(out.reasons.join(" "), /Reconnect extension/);
  assert.match(out.reasons.join(" "), /Select browser/);
});

test("tab-group-orphan chip", () => {
  const out = decide({ seed: "tab-group-orphan", tabGroupOrphan: true });
  assert.equal(out.verdict, "tab-group-orphan");
  assert.match(out.reasons.join(" "), /isMcp/);
  assert.match(out.reasons.join(" "), /not in Claude's tab group/);
});

test("session-mapping-lost chip", () => {
  const out = decide({ seed: "session-mapping-lost", sessionMappingLost: true });
  assert.equal(out.verdict, "session-mapping-lost");
  assert.match(out.reasons.join(" "), /memory/);
});

test("createIfEmpty-new-tab-only chip", () => {
  const out = decide({ seed: "createIfEmpty-new-tab-only", createIfEmptyNewTabOnly: true });
  assert.equal(out.verdict, "createIfEmpty-new-tab-only");
  assert.match(out.reasons.join(" "), /createIfEmpty/);
  assert.match(out.reasons.join(" "), /tabs_create_mcp/);
});

test("chrome-relaunch-not-sleep chip", () => {
  const out = decide({ seed: "chrome-relaunch-not-sleep", chromeRelaunchNotSleep: true });
  assert.equal(out.verdict, "chrome-relaunch-not-sleep");
  assert.match(out.reasons.join(" "), /not sleep\/wake/);
  assert.match(out.reasons.join(" "), /152\.0\.7977/);
});

test("cousins cite-only", () => {
  const out = decide({
    seed: "cousins",
    cousinsCiteOnly: [88558, 86793, 61117, 73903, 87774, 89335]
  });
  assert.equal(out.verdict, "cousins");
  assert.match(out.reasons.join(" "), /#88558/);
  assert.match(out.reasons.join(" "), /#86793/);
  assert.match(out.reasons.join(" "), /#61117/);
  assert.match(out.reasons.join(" "), /#73903/);
  assert.match(out.reasons.join(" "), /#87774/);
  assert.match(out.reasons.join(" "), /#89335/);
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
  assert.equal(idle.verdict, "severed");
  assert.equal(score(seedRemoored()).verdict, "remoored");
  assert.equal(handle('{"seed":"severed","severed":true}').verdict, "severed");
  assert.equal(handle({ seed: "remoored", remoored: true }).verdict, "remoored");
  const bag = seeds();
  assert.equal(decide(bag.severed).verdict, "severed");
  assert.equal(decide(bag.remoored).verdict, "remoored");
  assert.equal(scoreFields(seedSevered()).severed, true);
});

test("fingerprint and signals detect gangway facts", () => {
  assert.equal(
    severedSignal("ALARM: gangway severed; never re-dial; not connected"),
    true
  );
  assert.equal(remooredSignal("remoored; re-dial the new; re-adopt"), true);
  assert.equal(
    neverRedialSignal("never-redial never re-dial 100 attempts Will retry on next tool call"),
    true
  );
  assert.equal(
    healthySocketSignal("healthy-socket execute_tool chrome-native-host .sock"),
    true
  );
  assert.equal(reconnectNoopSignal("reconnect-noop Reconnect extension Select browser"), true);
  assert.equal(
    tabGroupOrphanSignal("tab-group-orphan isMcp not in Claude's tab group"),
    true
  );
  assert.equal(
    sessionMappingSignal("session-mapping-lost session→group lives only in memory"),
    true
  );
  assert.equal(
    createIfEmptySignal("createIfEmpty-new-tab createIfEmpty tabs_create_mcp NEW tab"),
    true
  );
  assert.equal(
    chromeRelaunchSignal("chrome-relaunch-not-sleep Chrome relaunch not sleep/wake 152.0.7977"),
    true
  );
  const hits = signals(seedSevered());
  assert.equal(hits.neverRedial || hits.healthySocket || hits.severed, true);
  const print = fingerprint(seedSevered());
  assert.equal(print.neverRedial, true);
  assert.equal(print.severedHit, true);
});

test("fingerprint scores remoored clean brow path", () => {
  const print = fingerprint(seedRemoored());
  assert.equal(print.remooredClean, true);
  assert.equal(print.severedHit, false);
  const out = decide({ ...seedRemoored(), seed: "remoored" });
  assert.equal(out.remoored, true);
  assert.equal(out.verdict, "remoored");
  assert.equal(gangwayRemoored(seedRemoored()), true);
  assert.equal(gangwayRemoored(seedSevered()), false);
});

test("classify idle vs hold flags", () => {
  const idle = classify(seedSevered());
  assert.equal(idle.severed, true);
  const hold = classify(seedRemoored());
  assert.equal(hold.remoored, true);
});

test("brows are shore / brow / ship", () => {
  assert.ok(BROWS.length === 3);
  assert.ok(BROWS.some((row) => row.id === "shore" && row.remoored === false));
  assert.ok(BROWS.some((row) => row.id === "brow" && row.remoored === false));
  assert.ok(BROWS.some((row) => row.id === "ship" && row.remoored === false));
});

test("measured facts from #92662", () => {
  assert.equal(MEASURED.issue, 92662);
  assert.equal(MEASURED.state, "open");
  assert.deepEqual(MEASURED.labels, [
    "bug",
    "has repro",
    "platform:macos",
    "area:browser-extension",
    "area:chrome"
  ]);
  assert.equal(MEASURED.filed, "2026-09-07T12:52:49Z");
  assert.equal(MEASURED.updated, "2026-09-07T12:53:59Z");
  assert.equal(MEASURED.reporter, "PromotezCitizen");
  assert.equal(MEASURED.comments, 0);
  assert.equal(MEASURED.claudeCode, "2.1.260");
  assert.equal(MEASURED.chrome, "152.0.7977.83");
  assert.equal(MEASURED.chromeFrom, "152.0.7977.76");
  assert.equal(MEASURED.extension, "1.0.91");
  assert.equal(MEASURED.nativeHost, "claude --chrome-native-host");
  assert.equal(MEASURED.nativeHostPid, 30308);
  assert.equal(MEASURED.reconnectAttempts, 100);
  assert.equal(MEASURED.tabId, 1277550962);
  assert.equal(MEASURED.isMcp, true);
  assert.equal(MEASURED.notSleepWake, true);
  assert.equal(IDLE_WORD, "severed");
  assert.equal(SEEDED_WORD, "remoored");
});

test("HOLD is remoored; ALARM is severed family", () => {
  assert.ok(HOLD.has("remoored"));
  assert.equal(ALARM.has("remoored"), false);
  for (const chip of [
    "severed",
    "never-redial",
    "healthy-socket-ignored",
    "reconnect-noop",
    "tab-group-orphan",
    "session-mapping-lost",
    "createIfEmpty-new-tab-only",
    "chrome-relaunch-not-sleep",
    "cousins",
    "has-clear-repro"
  ]) {
    assert.ok(ALARM.has(chip), chip);
  }
  assert.deepEqual(CHIPS, VERDICTS);
  assert.deepEqual(VERDICTS, [
    "severed",
    "remoored",
    "never-redial",
    "healthy-socket-ignored",
    "reconnect-noop",
    "tab-group-orphan",
    "session-mapping-lost",
    "createIfEmpty-new-tab-only",
    "chrome-relaunch-not-sleep",
    "cousins",
    "has-clear-repro"
  ]);
});

test("cousins table is cite-only 88558 / 86793 / 61117 / 73903 / 87774 / 89335", () => {
  assert.deepEqual(
    COUSINS.map((c) => c.id),
    [88558, 86793, 61117, 73903, 87774, 89335]
  );
});

test("fixtures encode issue facts and score their seeds", () => {
  const files = [
    "severed.json",
    "remoored.json",
    "92662.json",
    "never-redial.json",
    "healthy-socket-ignored.json",
    "reconnect-noop.json",
    "tab-group-orphan.json",
    "session-mapping-lost.json",
    "createIfEmpty-new-tab-only.json",
    "chrome-relaunch-not-sleep.json",
    "cousins.json",
    "fixtures.json",
    "has-clear-repro.json"
  ];
  for (const name of files) {
    const raw = readFileSync(join(root, "data", name), "utf8");
    assert.match(raw, /92662|gangway|severed|remoored/i);
    if (name !== "fixtures.json") {
      const fixture = JSON.parse(raw);
      const out = decide(fixture);
      assert.ok(VERDICTS.includes(out.verdict), `${name} → ${out.verdict}`);
    }
  }
  const index = JSON.parse(readFileSync(join(root, "data", "fixtures.json"), "utf8"));
  assert.equal(index.narrativeNotFixture.idle, "severed");
  assert.equal(index.narrativeNotFixture.seeded, "remoored");
  assert.ok(index.narrativeNotFixture.labels.includes("has repro"));
  assert.ok(index.narrativeNotFixture.labels.includes("area:chrome"));
  const listed = readdirSync(join(root, "data"));
  assert.ok(listed.includes("README.md"));
});

test("living page is a pier gangway brow, not a clone", () => {
  assert.match(page, /Big Shoulders Display/);
  assert.match(page, /Public Sans/);
  assert.match(page, /Roboto Mono/);
  assert.doesNotMatch(page, /Oswald/);
  assert.doesNotMatch(page, /Source Sans 3/);
  assert.doesNotMatch(page, /IBM Plex Mono/);
  assert.doesNotMatch(page, /Newsreader/);
  assert.doesNotMatch(page, /Figtree/);
  assert.doesNotMatch(page, /Fragment Mono/);
  assert.doesNotMatch(page, /Petrona/);
  assert.doesNotMatch(page, /Lexend/);
  assert.doesNotMatch(page, /Azeret Mono/);
  assert.doesNotMatch(page, /Instrument Serif/);
  assert.doesNotMatch(page, /Plus Jakarta Sans/);
  assert.doesNotMatch(page, /Fraunces/);
  assert.doesNotMatch(page, /JetBrains Mono/);
  assert.match(page, /severed/);
  assert.match(page, /remoored/);
  assert.match(page, /#92662/);
  assert.match(page, /Gangway/);
  assert.match(page, /embed/);
  assert.match(page, /\?embed=1/);
  assert.match(page, /01:50 \/ hermes catalog #208 \/ #92662/);
  assert.match(page, /Score the gangway/);
  assert.match(page, /Pin idle severed/);
  assert.match(page, /Pin seeded remoored/);
  assert.match(page, /Admit remoored/);
  assert.match(page, /Load fixtures/);
  assert.match(page, /Reset to remoored/);
  assert.match(page, /Lower the brow/);
  assert.match(page, /Cast the brow/);
  assert.match(page, /gangway|boarding brow|pier|grated steel|sodium|rope/i);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /88558/);
  assert.match(page, /86793/);
  assert.match(page, /61117/);
  assert.match(page, /73903/);
  assert.match(page, /87774/);
  assert.match(page, /89335/);
  assert.match(page, /2\.1\.260/);
  assert.match(page, /152\.0\.7977/);
});

test("page stays off neighboring UIs and prior idle words", () => {
  assert.doesNotMatch(page, /freight waybill/i);
  assert.doesNotMatch(page, /consignment ticket/i);
  assert.doesNotMatch(page, /snatch-block/i);
  assert.doesNotMatch(page, /openable pulley/i);
  assert.doesNotMatch(page, /phosphor persistence/i);
  assert.doesNotMatch(page, /limber-hole/i);
  assert.doesNotMatch(page, /wheel-chock/i);
  assert.doesNotMatch(page, /deadman's switch/i);
  assert.doesNotMatch(page, /glass-plate/i);
  assert.doesNotMatch(page, /brass speakpipe/i);
  assert.doesNotMatch(page, /speaking-tube/i);
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
  assert.doesNotMatch(page, /\bsole\b/);
});

test("README anti-clone encodes the gangway thesis", () => {
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /never re-dial/i);
  assert.match(readme, /PromotezCitizen/);
  assert.match(readme, /#88558/);
  assert.match(readme, /#86793/);
  assert.match(readme, /#61117/);
  assert.match(readme, /How to score/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/gangway\//);
  assert.match(readme, /Score severed or admit remoored/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /NOT Waybill/);
  assert.match(readme, /NOT Snatch/);
  assert.match(hookReadme, /severed/);
  assert.match(hookReadme, /remoored/);
  assert.match(dataReadme, /severed/);
  assert.match(dataReadme, /remoored/);
});
