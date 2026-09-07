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
  seedAdrift,
  seedReaped,
  fingerprint,
  signals,
  adriftSignal,
  reapedSignal,
  unreapedSignal,
  timeoutSignal,
  immortalSignal,
  handlePoolSignal,
  nineOfNineSignal,
  deadParentSignal,
  wallClockSignal,
  findOrphansSignal,
  pagedPoolSignal,
  mycroftSignal,
  immortalTailSignal,
  wallClockCeilingSignal,
  lineReaped,
  HOLD,
  ALARM,
  MEASURED,
  CHIPS,
  VERDICTS,
  COUSINS,
  BLOCKS,
  IDLE_WORD,
  SEEDED_WORD
} from "./snatch.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const page = readFileSync(join(root, "index.html"), "utf8");
const readme = readFileSync(join(root, "README.md"), "utf8");
const hookReadme = readFileSync(join(root, "hook", "README.md"), "utf8");
const dataReadme = readFileSync(join(root, "data", "README.md"), "utf8");

test("primary 92583 fixture scores adrift", () => {
  const primary = JSON.parse(readFileSync(join(root, "data", "92583.json"), "utf8"));
  const out = decide(primary);
  assert.equal(out.verdict, "adrift");
  assert.equal(out.adrift, true);
  assert.ok(out.chips.includes("adrift"));
});

test("empty / idle probe is adrift", () => {
  const out = decide({});
  assert.equal(out.verdict, "adrift");
  assert.equal(out.adrift, true);
  assert.equal(out.reaped, false);
  assert.ok(ALARM.has("adrift"));
  assert.equal(IDLE_WORD, "adrift");
});

test("seeded adrift scores adrift", () => {
  const out = decide(seedAdrift());
  assert.equal(out.verdict, "adrift");
  assert.equal(out.adrift, true);
  assert.ok(out.chips.includes("adrift"));
  assert.ok(out.chips.includes("unreaped-on-session-end"));
  assert.ok(out.chips.includes("timeout-to-background"));
});

test("reaped seed is a hold", () => {
  const out = decide(seedReaped());
  assert.equal(out.verdict, "reaped");
  assert.equal(out.reaped, true);
  assert.equal(out.adrift, false);
  assert.ok(HOLD.has(out.verdict));
  assert.equal(SEEDED_WORD, "reaped");
});

test("unreaped-on-session-end chip", () => {
  const out = decide({ seed: "unreaped-on-session-end", unreapedOnSessionEnd: true });
  assert.equal(out.verdict, "unreaped-on-session-end");
  assert.equal(out.adrift, true);
  assert.match(out.reasons.join(" "), /orphaned/);
  assert.match(out.reasons.join(" "), /session/);
});

test("timeout-to-background chip", () => {
  const out = decide({ seed: "timeout-to-background", timeoutToBackground: true });
  assert.equal(out.verdict, "timeout-to-background");
  assert.ok(out.chips.includes("timeout-to-background"));
  assert.match(out.reasons.join(" "), /120s/);
  assert.match(out.reasons.join(" "), /Win32_Product/);
});

test("immortal-background-commands chip", () => {
  const out = decide({ seed: "immortal-background-commands", immortalBackgroundCommands: true });
  assert.equal(out.verdict, "immortal-background-commands");
  assert.match(out.reasons.join(" "), /tail -f/);
  assert.match(out.reasons.join(" "), /http\.server/);
});

test("handle-pool-exhaustion chip", () => {
  const out = decide({ seed: "handle-pool-exhaustion", handlePoolExhaustion: true });
  assert.equal(out.verdict, "handle-pool-exhaustion");
  assert.match(out.reasons.join(" "), /61,252,162/);
  assert.match(out.reasons.join(" "), /20\.8 GB/);
});

test("nine-of-nine-orphans chip", () => {
  const out = decide({ seed: "nine-of-nine-orphans", nineOfNineOrphans: true });
  assert.equal(out.verdict, "nine-of-nine-orphans");
  assert.match(out.reasons.join(" "), /9 of 9/);
  assert.match(out.reasons.join(" "), /22\.1h/);
});

test("dead-parent-git-bash chip", () => {
  const out = decide({ seed: "dead-parent-git-bash", deadParentGitBash: true });
  assert.equal(out.verdict, "dead-parent-git-bash");
  assert.match(out.reasons.join(" "), /snapshot-bash/);
  assert.match(out.reasons.join(" "), /54\.0h/);
});

test("wall-clock-not-handle-ceiling chip", () => {
  const out = decide({ seed: "wall-clock-not-handle-ceiling", wallClockNotHandleCeiling: true });
  assert.equal(out.verdict, "wall-clock-not-handle-ceiling");
  assert.match(out.reasons.join(" "), /129–165/);
  assert.match(out.reasons.join(" "), /1,267/);
});

test("find-orphans-11-days chip", () => {
  const out = decide({ seed: "find-orphans-11-days", findOrphans11Days: true });
  assert.equal(out.verdict, "find-orphans-11-days");
  assert.match(out.reasons.join(" "), /find\.exe/);
  assert.match(out.reasons.join(" "), /11 days/);
});

test("handle-pool-20gb chip", () => {
  const out = decide({ seed: "handle-pool-20gb", handlePool20gb: true });
  assert.equal(out.verdict, "handle-pool-20gb");
  assert.match(out.reasons.join(" "), /20\.8 GB/);
  assert.match(out.reasons.join(" "), /247,000/);
});

test("mycroft-9-of-9 chip", () => {
  const out = decide({ seed: "mycroft-9-of-9", mycroft9Of9: true });
  assert.equal(out.verdict, "mycroft-9-of-9");
  assert.match(out.reasons.join(" "), /Mycroft/);
  assert.match(out.reasons.join(" "), /tonydzi/);
});

test("immortal-tail-http chip", () => {
  const out = decide({ seed: "immortal-tail-http", immortalTailHttp: true });
  assert.equal(out.verdict, "immortal-tail-http");
  assert.match(out.reasons.join(" "), /http\.server 41888/);
  assert.match(out.reasons.join(" "), /tail -f/);
});

test("wall-clock-ceiling chip", () => {
  const out = decide({ seed: "wall-clock-ceiling", wallClockCeiling: true });
  assert.equal(out.verdict, "wall-clock-ceiling");
  assert.match(out.reasons.join(" "), /hard ceiling/);
  assert.match(out.reasons.join(" "), /wall-clock/);
});

test("cousins cite-only", () => {
  const out = decide({ seed: "cousins", cousinsCiteOnly: [91642, 92593, 92586] });
  assert.equal(out.verdict, "cousins");
  assert.match(out.reasons.join(" "), /#91642/);
  assert.match(out.reasons.join(" "), /#92593/);
  assert.match(out.reasons.join(" "), /#92586/);
  assert.match(out.reasons.join(" "), /Speakpipe/);
  assert.match(out.reasons.join(" "), /Afterimage/);
});

test("has-clear-repro chip from labels", () => {
  const out = decide({ seed: "has-clear-repro", hasClearRepro: true });
  assert.equal(out.verdict, "has-clear-repro");
  assert.match(out.reasons.join(" "), /has-clear-repro/);
  assert.match(out.reasons.join(" "), /has repro/);
});

test("analyze / score / handle / seeds / scoreFields", () => {
  const idle = analyze({});
  assert.equal(idle.verdict, "adrift");
  assert.equal(score(seedReaped()).verdict, "reaped");
  assert.equal(handle('{"seed":"adrift","adrift":true}').verdict, "adrift");
  assert.equal(handle({ seed: "reaped", reaped: true }).verdict, "reaped");
  const bag = seeds();
  assert.equal(decide(bag.adrift).verdict, "adrift");
  assert.equal(decide(bag.reaped).verdict, "reaped");
  assert.equal(scoreFields(seedAdrift()).adrift, true);
});

test("fingerprint and signals detect snatch facts", () => {
  assert.equal(adriftSignal("ALARM: line adrift; unreaped dead parent"), true);
  assert.equal(reapedSignal("session-end tracks and reaps; bring the line home"), true);
  assert.equal(unreapedSignal("unreaped-on-session-end; window closed; orphaned children"), true);
  assert.equal(timeoutSignal("timeout-to-background moved to background 120s Win32_Product"), true);
  assert.equal(immortalSignal("immortal-background-commands immortal-by-construction"), true);
  assert.equal(handlePoolSignal("handle-pool-exhaustion 61,252,162 10–11 million"), true);
  assert.equal(nineOfNineSignal("nine-of-nine-orphans 9 of 9"), true);
  assert.equal(deadParentSignal("dead-parent-git-bash parent shells already exited snapshot-bash"), true);
  assert.equal(wallClockSignal("wall-clock-not-handle-ceiling 129–165 1,267 handle-count ceiling"), true);
  assert.equal(findOrphansSignal("find-orphans-11-days find.exe Aug 27 11 days reparse-point"), true);
  assert.equal(pagedPoolSignal("handle-pool-20gb 20.8 GB 247,000 paged pool"), true);
  assert.equal(mycroftSignal("mycroft-9-of-9 Mycroft tonydzi"), true);
  assert.equal(immortalTailSignal("immortal-tail-http tail -f http.server 41888 nohup python"), true);
  assert.equal(wallClockCeilingSignal("wall-clock-ceiling hard ceiling wall-clock or handle-count"), true);
  const hits = signals(seedAdrift());
  assert.equal(hits.unreaped || hits.timeout || hits.findOrphans, true);
  const print = fingerprint(seedAdrift());
  assert.equal(print.unreaped, true);
  assert.equal(print.adriftHit, true);
});

test("fingerprint scores reaped clean line-home path", () => {
  const print = fingerprint(seedReaped());
  assert.equal(print.reapedClean, true);
  assert.equal(print.adriftHit, false);
  const out = decide({ ...seedReaped(), seed: "reaped" });
  assert.equal(out.reaped, true);
  assert.equal(out.verdict, "reaped");
  assert.equal(lineReaped(seedReaped()), true);
  assert.equal(lineReaped(seedAdrift()), false);
});

test("classify idle vs hold flags", () => {
  const idle = classify(seedAdrift());
  assert.equal(idle.adrift, true);
  const hold = classify(seedReaped());
  assert.equal(hold.reaped, true);
});

test("blocks are yard / cheek / sheave", () => {
  assert.ok(BLOCKS.length === 3);
  assert.ok(BLOCKS.some((row) => row.id === "yard" && row.open === true));
  assert.ok(BLOCKS.some((row) => row.id === "cheek" && row.open === false));
  assert.ok(BLOCKS.some((row) => row.id === "sheave" && row.open === false));
});

test("measured facts from #92583", () => {
  assert.equal(MEASURED.issue, 92583);
  assert.equal(MEASURED.state, "open");
  assert.deepEqual(MEASURED.labels, [
    "bug",
    "has repro",
    "platform:windows",
    "area:bash"
  ]);
  assert.equal(MEASURED.filed, "2026-09-07T02:11:29Z");
  assert.equal(MEASURED.updated, "2026-09-07T05:50:30Z");
  assert.equal(MEASURED.reporter, "cloud-hai-vo");
  assert.equal(MEASURED.comments, 1);
  assert.equal(MEASURED.confirmer, "tonydzi");
  assert.equal(MEASURED.confirmerVoice, "Mycroft");
  assert.equal(MEASURED.os, "Windows 11 Pro 10.0.26200");
  assert.equal(MEASURED.findOrphans, 6);
  assert.equal(MEASURED.systemHandleCount, 61252162);
  assert.equal(MEASURED.kernelPagedPoolGb, 20.8);
  assert.equal(MEASURED.handlesAfterKill, 247000);
  assert.equal(MEASURED.mycroftOrphans, 9);
  assert.equal(MEASURED.mycroftHandlesTotal, 1267);
  assert.equal(MEASURED.maxAgeDays, 11);
  assert.equal(MEASURED.midInvestigationTimeoutS, 120);
  assert.equal(MEASURED.memoryUtilPercent, 98);
  assert.equal(IDLE_WORD, "adrift");
  assert.equal(SEEDED_WORD, "reaped");
});

test("HOLD is reaped; ALARM is adrift family", () => {
  assert.ok(HOLD.has("reaped"));
  assert.equal(ALARM.has("reaped"), false);
  for (const chip of [
    "adrift",
    "unreaped-on-session-end",
    "timeout-to-background",
    "immortal-background-commands",
    "handle-pool-exhaustion",
    "nine-of-nine-orphans",
    "dead-parent-git-bash",
    "wall-clock-not-handle-ceiling",
    "find-orphans-11-days",
    "handle-pool-20gb",
    "mycroft-9-of-9",
    "immortal-tail-http",
    "wall-clock-ceiling",
    "cousins",
    "has-clear-repro"
  ]) {
    assert.ok(ALARM.has(chip), chip);
  }
  assert.deepEqual(CHIPS, VERDICTS);
  assert.deepEqual(VERDICTS, [
    "adrift",
    "reaped",
    "unreaped-on-session-end",
    "timeout-to-background",
    "immortal-background-commands",
    "handle-pool-exhaustion",
    "nine-of-nine-orphans",
    "dead-parent-git-bash",
    "wall-clock-not-handle-ceiling",
    "find-orphans-11-days",
    "handle-pool-20gb",
    "mycroft-9-of-9",
    "immortal-tail-http",
    "wall-clock-ceiling",
    "cousins",
    "has-clear-repro"
  ]);
});

test("cousins table is cite-only 91642 / 92593 / 92586", () => {
  assert.deepEqual(
    COUSINS.map((c) => c.id),
    [91642, 92593, 92586]
  );
});

test("fixtures encode issue facts and score their seeds", () => {
  const files = [
    "adrift.json",
    "reaped.json",
    "92583.json",
    "unreaped-on-session-end.json",
    "timeout-to-background.json",
    "immortal-background-commands.json",
    "handle-pool-exhaustion.json",
    "nine-of-nine-orphans.json",
    "dead-parent-git-bash.json",
    "wall-clock-not-handle-ceiling.json",
    "find-orphans-11-days.json",
    "handle-pool-20gb.json",
    "mycroft-9-of-9.json",
    "immortal-tail-http.json",
    "wall-clock-ceiling.json",
    "cousins.json",
    "fixtures.json",
    "has-clear-repro.json"
  ];
  for (const name of files) {
    const raw = readFileSync(join(root, "data", name), "utf8");
    assert.match(raw, /92583|snatch|adrift|reaped/i);
    if (name !== "fixtures.json") {
      const fixture = JSON.parse(raw);
      const out = decide(fixture);
      assert.ok(VERDICTS.includes(out.verdict), `${name} → ${out.verdict}`);
    }
  }
  const index = JSON.parse(readFileSync(join(root, "data", "fixtures.json"), "utf8"));
  assert.equal(index.narrativeNotFixture.idle, "adrift");
  assert.equal(index.narrativeNotFixture.seeded, "reaped");
  assert.ok(index.narrativeNotFixture.labels.includes("has repro"));
  assert.ok(index.narrativeNotFixture.labels.includes("area:bash"));
  const listed = readdirSync(join(root, "data"));
  assert.ok(listed.includes("README.md"));
});

test("living page is a deck snatch-block bench, not a clone", () => {
  assert.match(page, /Newsreader/);
  assert.match(page, /Figtree/);
  assert.match(page, /Fragment Mono/);
  assert.doesNotMatch(page, /Petrona/);
  assert.doesNotMatch(page, /Lexend/);
  assert.doesNotMatch(page, /Azeret Mono/);
  assert.doesNotMatch(page, /Instrument Serif/);
  assert.doesNotMatch(page, /Plus Jakarta Sans/);
  assert.doesNotMatch(page, /IBM Plex Mono/);
  assert.doesNotMatch(page, /Fraunces/);
  assert.doesNotMatch(page, /Source Sans 3/);
  assert.doesNotMatch(page, /JetBrains Mono/);
  assert.doesNotMatch(page, /Bitter/);
  assert.doesNotMatch(page, /Manrope/);
  assert.doesNotMatch(page, /Chakra Petch/);
  assert.doesNotMatch(page, /Share Tech Mono/);
  assert.doesNotMatch(page, /Playfair Display/);
  assert.doesNotMatch(page, /Work Sans/);
  assert.doesNotMatch(page, /Fira Code/);
  assert.doesNotMatch(page, /Cinzel/);
  assert.match(page, /adrift/);
  assert.match(page, /reaped/);
  assert.match(page, /#92583/);
  assert.match(page, /Snatch/);
  assert.match(page, /embed/);
  assert.match(page, /\?embed=1/);
  assert.match(page, /22:50 \/ hermes catalog #206 \/ #92583/);
  assert.match(page, /Score the snatch-block/);
  assert.match(page, /Pin idle adrift/);
  assert.match(page, /Pin seeded reaped/);
  assert.match(page, /Admit reaped/);
  assert.match(page, /Load fixtures/);
  assert.match(page, /Reset to reaped/);
  assert.match(page, /Bring the line home/);
  assert.match(page, /Open the cheek/);
  assert.match(page, /snatch-block|openable pulley|hinged cheek|sheave|beckets/i);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /91642/);
  assert.match(page, /92593/);
  assert.match(page, /92586/);
  assert.match(page, /61,252,162/);
  assert.match(page, /find\.exe/);
  assert.match(page, /Mycroft/);
});

test("page stays off neighboring UIs and prior idle words", () => {
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

test("README anti-clone encodes the snatch thesis", () => {
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /session-end/);
  assert.match(readme, /61,252,162/);
  assert.match(readme, /cloud-hai-vo/);
  assert.match(readme, /#91642/);
  assert.match(readme, /#92593/);
  assert.match(readme, /#92586/);
  assert.match(readme, /How to score/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/snatch\//);
  assert.match(readme, /Score adrift or admit reaped/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /NOT Speakpipe/);
  assert.match(readme, /NOT Deadman/);
  assert.match(hookReadme, /adrift/);
  assert.match(hookReadme, /reaped/);
  assert.match(dataReadme, /adrift/);
  assert.match(dataReadme, /reaped/);
});
