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
  seedRunaway,
  seedLatched,
  fingerprint,
  msysBackslashSignal,
  timeoutBackgroundSignal,
  taskStopShellOnlySignal,
  driveWipeSignal,
  jobObjectSignal,
  wouldDenyCatastrophic,
  HOLD,
  ALARM,
  MEASURED,
  CHIPS,
  VERDICTS,
  COUSINS,
  CATASTROPHIC_TARGETS,
  IDLE_WORD,
  SEEDED_WORD
} from "./deadman.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const page = readFileSync(join(root, "index.html"), "utf8");
const readme = readFileSync(join(root, "README.md"), "utf8");
const hookReadme = readFileSync(join(root, "hook", "README.md"), "utf8");
const dataReadme = readFileSync(join(root, "data", "README.md"), "utf8");

test("primary 92593 fixture scores runaway", () => {
  const primary = JSON.parse(readFileSync(join(root, "data", "92593.json"), "utf8"));
  const out = decide(primary);
  assert.equal(out.verdict, "runaway");
  assert.equal(out.runaway, true);
  assert.ok(out.chips.includes("runaway"));
});

test("empty / idle probe is runaway", () => {
  const out = decide({});
  assert.equal(out.verdict, "runaway");
  assert.equal(out.runaway, true);
  assert.equal(out.latched, false);
  assert.ok(ALARM.has("runaway"));
  assert.equal(IDLE_WORD, "runaway");
});

test("seeded runaway scores runaway", () => {
  const out = decide(seedRunaway());
  assert.equal(out.verdict, "runaway");
  assert.equal(out.runaway, true);
  assert.ok(out.chips.includes("runaway"));
  assert.ok(out.chips.includes("timeout-background"));
  assert.ok(out.chips.includes("taskstop-shell-only"));
});

test("latched seed is a hold", () => {
  const out = decide(seedLatched());
  assert.equal(out.verdict, "latched");
  assert.equal(out.latched, true);
  assert.equal(out.runaway, false);
  assert.ok(HOLD.has(out.verdict));
  assert.equal(SEEDED_WORD, "latched");
});

test("timeout-background chip", () => {
  const out = decide({ seed: "timeout-background", timeoutBackground: true });
  assert.equal(out.verdict, "timeout-background");
  assert.equal(out.runaway, true);
  assert.match(out.reasons.join(" "), /2-minute/);
  assert.match(out.reasons.join(" "), /AUTO-BACKGROUNDED/);
});

test("taskstop-shell-only chip", () => {
  const out = decide({ seed: "taskstop-shell-only", taskStopShellOnly: true });
  assert.equal(out.verdict, "taskstop-shell-only");
  assert.ok(out.chips.includes("taskstop-shell-only"));
  assert.match(out.reasons.join(" "), /rm\.exe/);
  assert.match(out.reasons.join(" "), /taskkill \/T/);
});

test("msys-backslash-root chip", () => {
  const out = decide({ seed: "msys-backslash-root", msysBackslashRoot: true });
  assert.equal(out.verdict, "msys-backslash-root");
  assert.match(out.reasons.join(" "), /MSYS/);
  assert.match(out.reasons.join(" "), /drive/);
});

test("drive-wipe chip", () => {
  const out = decide({ seed: "drive-wipe", driveWipe: true });
  assert.equal(out.verdict, "drive-wipe");
  assert.match(out.reasons.join(" "), /C:\\dev/);
  assert.match(out.reasons.join(" "), /Volume Shadow Copy/);
});

test("job-object-missing chip", () => {
  const out = decide({ seed: "job-object-missing", jobObjectMissing: true });
  assert.equal(out.verdict, "job-object-missing");
  assert.match(out.reasons.join(" "), /Job Object/);
  assert.match(out.reasons.join(" "), /taskkill \/T/);
});

test("cousins cite-only", () => {
  const out = decide({ seed: "cousins", cousinsCiteOnly: [92583, 91642] });
  assert.equal(out.verdict, "cousins");
  assert.match(out.reasons.join(" "), /#92583/);
  assert.match(out.reasons.join(" "), /#91642/);
  assert.match(out.reasons.join(" "), /Bitts/);
  assert.match(out.reasons.join(" "), /Seizing/);
});

test("has-clear-repro chip from narrative", () => {
  const out = decide({ seed: "has-clear-repro", hasClearRepro: true });
  assert.equal(out.verdict, "has-clear-repro");
  assert.match(out.reasons.join(" "), /has-clear-repro/);
  assert.match(out.reasons.join(" "), /narrative/);
});

test("analyze / score / handle / seeds / scoreFields", () => {
  const idle = analyze({});
  assert.equal(idle.verdict, "runaway");
  assert.equal(score(seedLatched()).verdict, "latched");
  assert.equal(handle('{"seed":"runaway","runaway":true}').verdict, "runaway");
  assert.equal(handle({ seed: "latched", latched: true }).verdict, "latched");
  const bag = seeds();
  assert.equal(decide(bag.runaway).verdict, "runaway");
  assert.equal(decide(bag.latched).verdict, "latched");
  assert.equal(scoreFields(seedRunaway()).runaway, true);
});

test("fingerprint detects timeout, TaskStop, MSYS, wipe", () => {
  assert.equal(timeoutBackgroundSignal("AUTO-BACKGROUNDED after 2-minute timeout"), true);
  assert.equal(taskStopShellOnlySignal("TaskStop killed the shell but not the child rm.exe"), true);
  assert.equal(msysBackslashSignal("MSYS path translation resolved bare backslash to drive root"), true);
  assert.equal(driveWipeSignal("C:\\dev recovered via Volume Shadow Copy after 7 minutes"), true);
  assert.equal(jobObjectSignal("Job Object / taskkill /T"), true);
  const print = fingerprint(seedRunaway());
  assert.equal(print.timeoutBg, true);
  assert.equal(print.shellOnly, true);
  assert.equal(print.runawayHit, true);
});

test("fingerprint scores latched clean timeline", () => {
  const print = fingerprint(seedLatched());
  assert.equal(print.latchedClean, true);
  assert.equal(print.runawayHit, false);
  const out = decide({ ...seedLatched(), seed: "latched" });
  assert.equal(out.latched, true);
  assert.equal(out.verdict, "latched");
});

test("classify idle vs hold flags", () => {
  const idle = classify(seedRunaway());
  assert.equal(idle.runaway, true);
  const hold = classify(seedLatched());
  assert.equal(hold.latched, true);
});

test("educational denylist fixture does not execute deletes", () => {
  assert.ok(CATASTROPHIC_TARGETS.length >= 4);
  assert.ok(CATASTROPHIC_TARGETS.some((row) => row.id === "quoted-backslash"));
  assert.equal(wouldDenyCatastrophic({ denyCatastrophic: true }), true);
  assert.equal(wouldDenyCatastrophic({ seed: "latched" }), false);
});

test("measured facts from #92593", () => {
  assert.equal(MEASURED.issue, 92593);
  assert.equal(MEASURED.state, "open");
  assert.deepEqual(MEASURED.labels, [
    "bug",
    "platform:windows",
    "area:bash",
    "area:agents",
    "data-loss",
    "area:sandbox"
  ]);
  assert.equal(MEASURED.filed, "2026-09-07T04:34:56Z");
  assert.equal(MEASURED.updated, "2026-09-07T04:36:48Z");
  assert.equal(MEASURED.reporter, "janetyq");
  assert.equal(MEASURED.comments, 0);
  assert.equal(MEASURED.os, "Windows 11 Home (10.0.26200)");
  assert.equal(MEASURED.app, "Claude Code CLI");
  assert.equal(MEASURED.model, "claude-fable-5");
  assert.equal(MEASURED.childProcess, "rm.exe");
  assert.equal(MEASURED.wipeDurationMinutes, 7);
  assert.equal(MEASURED.childSurvivedMinutes, 5);
  assert.equal(MEASURED.bashTimeoutMinutes, 2);
  assert.equal(MEASURED.timeoutPromotedToBackground, true);
  assert.equal(MEASURED.taskStopReportedSuccess, true);
  assert.equal(MEASURED.childSurvived, true);
  assert.equal(MEASURED.jobObjectMissing, true);
  assert.equal(MEASURED.denylistMissing, true);
  assert.equal(IDLE_WORD, "runaway");
  assert.equal(SEEDED_WORD, "latched");
});

test("HOLD is latched; ALARM is runaway family", () => {
  assert.ok(HOLD.has("latched"));
  assert.equal(ALARM.has("latched"), false);
  for (const chip of [
    "runaway",
    "timeout-background",
    "taskstop-shell-only",
    "msys-backslash-root",
    "drive-wipe",
    "job-object-missing",
    "cousins",
    "has-clear-repro"
  ]) {
    assert.ok(ALARM.has(chip), chip);
  }
  assert.deepEqual(CHIPS, VERDICTS);
  assert.deepEqual(VERDICTS, [
    "runaway",
    "latched",
    "timeout-background",
    "taskstop-shell-only",
    "msys-backslash-root",
    "drive-wipe",
    "job-object-missing",
    "cousins",
    "has-clear-repro"
  ]);
});

test("cousins table is cite-only 92583 / 91642", () => {
  assert.deepEqual(
    COUSINS.map((c) => c.id),
    [92583, 91642]
  );
});

test("fixtures encode issue facts and score their seeds", () => {
  const files = [
    "runaway.json",
    "latched.json",
    "92593.json",
    "timeout-background.json",
    "taskstop-shell-only.json",
    "msys-backslash-root.json",
    "drive-wipe.json",
    "job-object-missing.json",
    "cousins.json",
    "fixtures.json",
    "has-clear-repro.json"
  ];
  for (const name of files) {
    const raw = readFileSync(join(root, "data", name), "utf8");
    assert.match(raw, /92593|deadman|runaway|latched/i);
    if (name !== "fixtures.json") {
      const fixture = JSON.parse(raw);
      const out = decide(fixture);
      assert.ok(VERDICTS.includes(out.verdict), `${name} → ${out.verdict}`);
    }
  }
  const index = JSON.parse(readFileSync(join(root, "data", "fixtures.json"), "utf8"));
  assert.equal(index.narrativeNotFixture.idle, "runaway");
  assert.equal(index.narrativeNotFixture.seeded, "latched");
  assert.ok(index.narrativeNotFixture.labels.includes("platform:windows"));
  assert.ok(index.narrativeNotFixture.labels.includes("area:bash"));
  const listed = readdirSync(join(root, "data"));
  assert.ok(listed.includes("README.md"));
});

test("living page is a locomotive deadman cab, not a clone", () => {
  assert.match(page, /Chakra Petch/);
  assert.match(page, /IBM Plex Sans/);
  assert.match(page, /Share Tech Mono/);
  assert.doesNotMatch(page, /Playfair Display/);
  assert.doesNotMatch(page, /Work Sans/);
  assert.doesNotMatch(page, /Fira Code/);
  assert.doesNotMatch(page, /Cinzel/);
  assert.doesNotMatch(page, /Plus Jakarta Sans/);
  assert.doesNotMatch(page, /Libre Bodoni/);
  assert.doesNotMatch(page, /Nunito/);
  assert.doesNotMatch(page, /Source Code Pro/);
  assert.doesNotMatch(page, /Libre Caslon/);
  assert.doesNotMatch(page, /Sora/);
  assert.doesNotMatch(page, /Inconsolata/);
  assert.doesNotMatch(page, /Lora/);
  assert.doesNotMatch(page, /Martian Mono/);
  assert.doesNotMatch(page, /Fraunces/);
  assert.doesNotMatch(page, /Figtree/);
  assert.doesNotMatch(page, /JetBrains/);
  assert.match(page, /runaway/);
  assert.match(page, /latched/);
  assert.match(page, /#92593/);
  assert.match(page, /Deadman/);
  assert.match(page, /embed/);
  assert.match(page, /\?embed=1/);
  assert.match(page, /17:50 \/ hermes catalog #201 \/ #92593/);
  assert.match(page, /Score the deadman/);
  assert.match(page, /Pin idle runaway/);
  assert.match(page, /Pin seeded latched/);
  assert.match(page, /Admit latched/);
  assert.match(page, /Load fixtures/);
  assert.match(page, /Reset to latched/);
  assert.match(page, /deadman|drive train|Job Object|taskkill/i);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /92583/);
  assert.match(page, /91642/);
});

test("page stays off neighboring UIs and prior idle words", () => {
  assert.doesNotMatch(page, /glass-plate/i);
  assert.doesNotMatch(page, /wet-plate/i);
  assert.doesNotMatch(page, /Lydian/i);
  assert.doesNotMatch(page, /mooring bitts/i);
  assert.doesNotMatch(page, /oak wharf/i);
  assert.doesNotMatch(page, /hemp warps/i);
  assert.doesNotMatch(page, /stuffing-box/i);
  assert.doesNotMatch(page, /packing gland/i);
  assert.doesNotMatch(page, /wooden fid/i);
  assert.doesNotMatch(page, /spun yarn/i);
  assert.doesNotMatch(page, /watchtower/i);
  assert.doesNotMatch(page, /larum-bell/i);
  assert.doesNotMatch(page, /seizing loft/i);
  assert.doesNotMatch(page, /kerf-gauge|kerf gauge/i);
  assert.doesNotMatch(page, /\bhaunted\b/);
  assert.doesNotMatch(page, /\bstaged\b/);
  assert.doesNotMatch(page, /\bfouled\b/);
  assert.doesNotMatch(page, /\bproved\b/);
  assert.doesNotMatch(page, /\brazed\b/);
  assert.doesNotMatch(page, /\bculled\b/);
  assert.doesNotMatch(page, /\bstripped\b/);
  assert.doesNotMatch(page, /\bpacked\b/);
  assert.doesNotMatch(page, /\bbelayed\b/);
  assert.doesNotMatch(page, /\bunanswered\b/);
  assert.doesNotMatch(page, /\broused\b/);
});

test("README anti-clone encodes the deadman thesis", () => {
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /TaskStop/);
  assert.match(readme, /MSYS/);
  assert.match(readme, /rm\.exe/);
  assert.match(readme, /janetyq/);
  assert.match(readme, /#92583/);
  assert.match(readme, /#91642/);
  assert.match(readme, /How to score/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/deadman\//);
  assert.match(readme, /Score runaway or admit latched/);
  assert.match(readme, /NON-BINDING/);
  assert.match(hookReadme, /runaway/);
  assert.match(hookReadme, /latched/);
  assert.match(dataReadme, /runaway/);
  assert.match(dataReadme, /latched/);
});
