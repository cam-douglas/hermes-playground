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
  seedMisrouted,
  seedAddressed,
  fingerprint,
  signals,
  misroutedSignal,
  addressedSignal,
  foreignSessionSignal,
  zeroOfTwentyOneSignal,
  regressionSignal,
  teamDirSignal,
  permissionsSignal,
  concurrencySignal,
  nameParamSignal,
  unnamedOkSignal,
  mailboxSignal,
  secondStringSignal,
  waybillAddressed,
  HOLD,
  ALARM,
  MEASURED,
  CHIPS,
  VERDICTS,
  COUSINS,
  STAMPS,
  IDLE_WORD,
  SEEDED_WORD
} from "./waybill.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const page = readFileSync(join(root, "index.html"), "utf8");
const readme = readFileSync(join(root, "README.md"), "utf8");
const hookReadme = readFileSync(join(root, "hook", "README.md"), "utf8");
const dataReadme = readFileSync(join(root, "data", "README.md"), "utf8");

test("primary 92624 fixture scores misrouted", () => {
  const primary = JSON.parse(readFileSync(join(root, "data", "92624.json"), "utf8"));
  const out = decide(primary);
  assert.equal(out.verdict, "misrouted");
  assert.equal(out.misrouted, true);
  assert.ok(out.chips.includes("misrouted"));
});

test("empty / idle probe is misrouted", () => {
  const out = decide({});
  assert.equal(out.verdict, "misrouted");
  assert.equal(out.misrouted, true);
  assert.equal(out.addressed, false);
  assert.ok(ALARM.has("misrouted"));
  assert.equal(IDLE_WORD, "misrouted");
});

test("seeded misrouted scores misrouted", () => {
  const out = decide(seedMisrouted());
  assert.equal(out.verdict, "misrouted");
  assert.equal(out.misrouted, true);
  assert.ok(out.chips.includes("misrouted"));
  assert.ok(out.chips.includes("foreign-session-id"));
  assert.ok(out.chips.includes("zero-of-twenty-one"));
});

test("addressed seed is a hold", () => {
  const out = decide(seedAddressed());
  assert.equal(out.verdict, "addressed");
  assert.equal(out.addressed, true);
  assert.equal(out.misrouted, false);
  assert.ok(HOLD.has(out.verdict));
  assert.equal(SEEDED_WORD, "addressed");
});

test("foreign-session-id chip", () => {
  const out = decide({ seed: "foreign-session-id", foreignSessionId: true });
  assert.equal(out.verdict, "foreign-session-id");
  assert.equal(out.misrouted, true);
  assert.match(out.reasons.join(" "), /7470f9d6/);
  assert.match(out.reasons.join(" "), /1b331b27/);
});

test("zero-of-twenty-one chip", () => {
  const out = decide({ seed: "zero-of-twenty-one", zeroOfTwentyOne: true });
  assert.equal(out.verdict, "zero-of-twenty-one");
  assert.ok(out.chips.includes("zero-of-twenty-one"));
  assert.match(out.reasons.join(" "), /0\/21/);
  assert.match(out.reasons.join(" "), /21\/21/);
});

test("regression-2-1-247 chip", () => {
  const out = decide({ seed: "regression-2-1-247", regression21247: true });
  assert.equal(out.verdict, "regression-2-1-247");
  assert.match(out.reasons.join(" "), /2\.1\.247/);
  assert.match(out.reasons.join(" "), /2\.1\.241/);
});

test("team-dir-never-created chip", () => {
  const out = decide({ seed: "team-dir-never-created", teamDirNeverCreated: true });
  assert.equal(out.verdict, "team-dir-never-created");
  assert.match(out.reasons.join(" "), /never created/);
  assert.match(out.reasons.join(" "), /2 of 6/);
});

test("not-permissions chip", () => {
  const out = decide({ seed: "not-permissions", notPermissions: true });
  assert.equal(out.verdict, "not-permissions");
  assert.match(out.reasons.join(" "), /owned by user/);
  assert.match(out.reasons.join(" "), /not found/);
});

test("not-only-concurrency chip", () => {
  const out = decide({ seed: "not-only-concurrency", notOnlyConcurrency: true });
  assert.equal(out.verdict, "not-only-concurrency");
  assert.match(out.reasons.join(" "), /52%/);
  assert.match(out.reasons.join(" "), /77%/);
});

test("name-param-path chip", () => {
  const out = decide({ seed: "name-param-path", nameParamPath: true });
  assert.equal(out.verdict, "name-param-path");
  assert.match(out.reasons.join(" "), /name:/);
  assert.match(out.reasons.join(" "), /mailbox/);
});

test("unnamed-spawn-ok chip", () => {
  const out = decide({ seed: "unnamed-spawn-ok", unnamedSpawnOk: true });
  assert.equal(out.verdict, "unnamed-spawn-ok");
  assert.match(out.reasons.join(" "), /73\/73/);
  assert.match(out.reasons.join(" "), /244\/245/);
});

test("mailbox-addressing-lost chip", () => {
  const out = decide({ seed: "mailbox-addressing-lost", mailboxAddressingLost: true });
  assert.equal(out.verdict, "mailbox-addressing-lost");
  assert.match(out.reasons.join(" "), /SendMessage/);
  assert.match(out.reasons.join(" "), /named addressing/);
});

test("second-string-cite-only chip", () => {
  const out = decide({ seed: "second-string-cite-only", secondStringCiteOnly: true });
  assert.equal(out.verdict, "second-string-cite-only");
  assert.match(out.reasons.join(" "), /#82627/);
  assert.match(out.reasons.join(" "), /unreadable/);
});

test("cousins cite-only", () => {
  const out = decide({ seed: "cousins", cousinsCiteOnly: [82627, 82493, 83366, 81852, 85949] });
  assert.equal(out.verdict, "cousins");
  assert.match(out.reasons.join(" "), /#82627/);
  assert.match(out.reasons.join(" "), /#82493/);
  assert.match(out.reasons.join(" "), /#83366/);
  assert.match(out.reasons.join(" "), /#81852/);
  assert.match(out.reasons.join(" "), /#85949/);
  assert.match(out.reasons.join(" "), /Snatch/);
  assert.match(out.reasons.join(" "), /Speakpipe/);
});

test("has-clear-repro chip from labels", () => {
  const out = decide({ seed: "has-clear-repro", hasClearRepro: true });
  assert.equal(out.verdict, "has-clear-repro");
  assert.match(out.reasons.join(" "), /has-clear-repro/);
  assert.match(out.reasons.join(" "), /has repro/);
});

test("analyze / score / handle / seeds / scoreFields", () => {
  const idle = analyze({});
  assert.equal(idle.verdict, "misrouted");
  assert.equal(score(seedAddressed()).verdict, "addressed");
  assert.equal(handle('{"seed":"misrouted","misrouted":true}').verdict, "misrouted");
  assert.equal(handle({ seed: "addressed", addressed: true }).verdict, "addressed");
  const bag = seeds();
  assert.equal(decide(bag.misrouted).verdict, "misrouted");
  assert.equal(decide(bag.addressed).verdict, "addressed");
  assert.equal(scoreFields(seedMisrouted()).misrouted, true);
});

test("fingerprint and signals detect waybill facts", () => {
  assert.equal(misroutedSignal("ALARM: waybill misrouted; foreign session id; team file not found; 0/21"), true);
  assert.equal(addressedSignal("stamp this session; current session id; THIS session"), true);
  assert.equal(foreignSessionSignal("foreign-session-id 7470f9d6 1b331b27 session-<id>"), true);
  assert.equal(zeroOfTwentyOneSignal("zero-of-twenty-one 0/21 21/21 mismatch"), true);
  assert.equal(regressionSignal("regression-2-1-247 2.1.247 2.1.241 2.1.263"), true);
  assert.equal(teamDirSignal("team-dir-never-created team directory never created 2 of 6"), true);
  assert.equal(permissionsSignal("not-permissions owned by user read/create/delete not a permission"), true);
  assert.equal(concurrencySignal("not-only-concurrency 52% 77% 1 live session"), true);
  assert.equal(nameParamSignal("name-param-path name: without `name:` team/mailbox"), true);
  assert.equal(unnamedOkSignal("unnamed-spawn-ok 73/73 without name: unnamed parcel"), true);
  assert.equal(mailboxSignal("mailbox-addressing-lost SendMessage({to:name}) named addressing"), true);
  assert.equal(secondStringSignal("second-string-cite-only #82627 unreadable (lock acquired, read failed)"), true);
  const hits = signals(seedMisrouted());
  assert.equal(hits.foreignSession || hits.zeroOfTwentyOne || hits.misrouted, true);
  const print = fingerprint(seedMisrouted());
  assert.equal(print.foreign, true);
  assert.equal(print.misroutedHit, true);
});

test("fingerprint scores addressed clean berth-stamped path", () => {
  const print = fingerprint(seedAddressed());
  assert.equal(print.addressedClean, true);
  assert.equal(print.misroutedHit, false);
  const out = decide({ ...seedAddressed(), seed: "addressed" });
  assert.equal(out.addressed, true);
  assert.equal(out.verdict, "addressed");
  assert.equal(waybillAddressed(seedAddressed()), true);
  assert.equal(waybillAddressed(seedMisrouted()), false);
});

test("classify idle vs hold flags", () => {
  const idle = classify(seedMisrouted());
  assert.equal(idle.misrouted, true);
  const hold = classify(seedAddressed());
  assert.equal(hold.addressed, true);
});

test("stamps are consignor / waybill / hold", () => {
  assert.ok(STAMPS.length === 3);
  assert.ok(STAMPS.some((row) => row.id === "consignor" && row.stamped === true));
  assert.ok(STAMPS.some((row) => row.id === "waybill" && row.stamped === false));
  assert.ok(STAMPS.some((row) => row.id === "hold" && row.stamped === false));
});

test("measured facts from #92624", () => {
  assert.equal(MEASURED.issue, 92624);
  assert.equal(MEASURED.state, "open");
  assert.deepEqual(MEASURED.labels, [
    "bug",
    "has repro",
    "platform:windows",
    "area:agents"
  ]);
  assert.equal(MEASURED.filed, "2026-09-07T09:10:56Z");
  assert.equal(MEASURED.updated, "2026-09-07T09:12:01Z");
  assert.equal(MEASURED.reporter, "yongseek-choi");
  assert.equal(MEASURED.comments, 0);
  assert.equal(MEASURED.os, "Windows 11 Enterprise 26200");
  assert.equal(MEASURED.claudeCodeLive, "2.1.263");
  assert.equal(MEASURED.regressionFrom, "2.1.247");
  assert.equal(MEASURED.lastKnownGood, "2.1.241");
  assert.equal(MEASURED.currentSessionId, "1b331b27");
  assert.equal(MEASURED.foreignSessionId, "7470f9d6");
  assert.equal(MEASURED.matchRate, "0/21");
  assert.equal(MEASURED.matchCount, 0);
  assert.equal(MEASURED.mismatchCount, 21);
  assert.equal(MEASURED.okBefore, 14);
  assert.equal(MEASURED.errBefore, 0);
  assert.equal(MEASURED.okAfter, 9);
  assert.equal(MEASURED.errAfter, 39);
  assert.equal(MEASURED.unnamedWorks, 73);
  assert.equal(MEASURED.failRateOneSession, 0.52);
  assert.equal(MEASURED.failRateTwoSessions, 0.77);
  assert.equal(MEASURED.notFoundCount, 21);
  assert.equal(MEASURED.secondStringCount, 18);
  assert.equal(IDLE_WORD, "misrouted");
  assert.equal(SEEDED_WORD, "addressed");
});

test("HOLD is addressed; ALARM is misrouted family", () => {
  assert.ok(HOLD.has("addressed"));
  assert.equal(ALARM.has("addressed"), false);
  for (const chip of [
    "misrouted",
    "foreign-session-id",
    "zero-of-twenty-one",
    "regression-2-1-247",
    "team-dir-never-created",
    "not-permissions",
    "not-only-concurrency",
    "name-param-path",
    "unnamed-spawn-ok",
    "mailbox-addressing-lost",
    "second-string-cite-only",
    "cousins",
    "has-clear-repro"
  ]) {
    assert.ok(ALARM.has(chip), chip);
  }
  assert.deepEqual(CHIPS, VERDICTS);
  assert.deepEqual(VERDICTS, [
    "misrouted",
    "addressed",
    "foreign-session-id",
    "zero-of-twenty-one",
    "regression-2-1-247",
    "team-dir-never-created",
    "not-permissions",
    "not-only-concurrency",
    "name-param-path",
    "unnamed-spawn-ok",
    "mailbox-addressing-lost",
    "second-string-cite-only",
    "cousins",
    "has-clear-repro"
  ]);
});

test("cousins table is cite-only 82627 / 82493 / 83366 / 81852 / 85949", () => {
  assert.deepEqual(
    COUSINS.map((c) => c.id),
    [82627, 82493, 83366, 81852, 85949]
  );
});

test("fixtures encode issue facts and score their seeds", () => {
  const files = [
    "misrouted.json",
    "addressed.json",
    "92624.json",
    "foreign-session-id.json",
    "zero-of-twenty-one.json",
    "regression-2-1-247.json",
    "team-dir-never-created.json",
    "not-permissions.json",
    "not-only-concurrency.json",
    "name-param-path.json",
    "unnamed-spawn-ok.json",
    "mailbox-addressing-lost.json",
    "second-string-cite-only.json",
    "cousins.json",
    "fixtures.json",
    "has-clear-repro.json"
  ];
  for (const name of files) {
    const raw = readFileSync(join(root, "data", name), "utf8");
    assert.match(raw, /92624|waybill|misrouted|addressed/i);
    if (name !== "fixtures.json") {
      const fixture = JSON.parse(raw);
      const out = decide(fixture);
      assert.ok(VERDICTS.includes(out.verdict), `${name} → ${out.verdict}`);
    }
  }
  const index = JSON.parse(readFileSync(join(root, "data", "fixtures.json"), "utf8"));
  assert.equal(index.narrativeNotFixture.idle, "misrouted");
  assert.equal(index.narrativeNotFixture.seeded, "addressed");
  assert.ok(index.narrativeNotFixture.labels.includes("has repro"));
  assert.ok(index.narrativeNotFixture.labels.includes("area:agents"));
  const listed = readdirSync(join(root, "data"));
  assert.ok(listed.includes("README.md"));
});

test("living page is a freight waybill desk, not a clone", () => {
  assert.match(page, /Oswald/);
  assert.match(page, /Source Sans 3/);
  assert.match(page, /IBM Plex Mono/);
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
  assert.doesNotMatch(page, /Bitter/);
  assert.doesNotMatch(page, /Manrope/);
  assert.doesNotMatch(page, /Chakra Petch/);
  assert.doesNotMatch(page, /Share Tech Mono/);
  assert.doesNotMatch(page, /Playfair Display/);
  assert.doesNotMatch(page, /Work Sans/);
  assert.doesNotMatch(page, /Fira Code/);
  assert.doesNotMatch(page, /Cinzel/);
  assert.match(page, /misrouted/);
  assert.match(page, /addressed/);
  assert.match(page, /#92624/);
  assert.match(page, /Waybill/);
  assert.match(page, /embed/);
  assert.match(page, /\?embed=1/);
  assert.match(page, /00:50 \/ hermes catalog #207 \/ #92624/);
  assert.match(page, /Score the waybill/);
  assert.match(page, /Pin idle misrouted/);
  assert.match(page, /Pin seeded addressed/);
  assert.match(page, /Admit addressed/);
  assert.match(page, /Load fixtures/);
  assert.match(page, /Reset to addressed/);
  assert.match(page, /Stamp the berth/);
  assert.match(page, /Route the parcel/);
  assert.match(page, /waybill|consignment|perforat|rubber.stamp|carbon|barcode|MISROUTED|ADDRESSED/i);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /82627/);
  assert.match(page, /82493/);
  assert.match(page, /83366/);
  assert.match(page, /81852/);
  assert.match(page, /85949/);
  assert.match(page, /7470f9d6/);
  assert.match(page, /1b331b27/);
  assert.match(page, /0\/21/);
  assert.match(page, /2\.1\.247/);
});

test("page stays off neighboring UIs and prior idle words", () => {
  assert.doesNotMatch(page, /snatch-block/i);
  assert.doesNotMatch(page, /openable pulley/i);
  assert.doesNotMatch(page, /hinged cheek/i);
  assert.doesNotMatch(page, /phosphor persistence/i);
  assert.doesNotMatch(page, /afterimage test card/i);
  assert.doesNotMatch(page, /limber-hole/i);
  assert.doesNotMatch(page, /bilge well/i);
  assert.doesNotMatch(page, /wheel-chock/i);
  assert.doesNotMatch(page, /oak wedge/i);
  assert.doesNotMatch(page, /deadman's switch/i);
  assert.doesNotMatch(page, /locomotive/i);
  assert.doesNotMatch(page, /glass-plate/i);
  assert.doesNotMatch(page, /wet-plate/i);
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
});

test("README anti-clone encodes the waybill thesis", () => {
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /foreign session id/);
  assert.match(readme, /0\/21/);
  assert.match(readme, /yongseek-choi/);
  assert.match(readme, /#82627/);
  assert.match(readme, /#82493/);
  assert.match(readme, /#83366/);
  assert.match(readme, /How to score/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/waybill\//);
  assert.match(readme, /Score misrouted or admit addressed/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /NOT Snatch/);
  assert.match(readme, /NOT Speakpipe/);
  assert.match(hookReadme, /misrouted/);
  assert.match(hookReadme, /addressed/);
  assert.match(dataReadme, /misrouted/);
  assert.match(dataReadme, /addressed/);
});
