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
  seedUnrung,
  seedQuieted,
  fingerprint,
  signals,
  unrungSignal,
  quietedSignal,
  startWithoutStopSignal,
  taskstopSilentSignal,
  exitStopSilentSignal,
  controlTollsSignal,
  debugFileMissingSignal,
  registryClearedSignal,
  pairingDriftSignal,
  quietusQuieted,
  pathRings,
  HOLD,
  ALARM,
  MEASURED,
  CHIPS,
  VERDICTS,
  COUSINS,
  HOOK_LOG,
  KILL_PATHS,
  IDLE_WORD,
  SEEDED_WORD
} from "./quietus.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const page = readFileSync(join(root, "index.html"), "utf8");
const readme = readFileSync(join(root, "README.md"), "utf8");
const hookReadme = readFileSync(join(root, "hook", "README.md"), "utf8");
const dataReadme = readFileSync(join(root, "data", "README.md"), "utf8");

test("primary 92716 fixture scores unrung", () => {
  const primary = JSON.parse(readFileSync(join(root, "data", "92716.json"), "utf8"));
  const out = decide(primary);
  assert.equal(out.verdict, "unrung");
  assert.equal(out.unrung, true);
  assert.ok(out.chips.includes("unrung"));
});

test("empty / idle probe is unrung", () => {
  const out = decide({});
  assert.equal(out.verdict, "unrung");
  assert.equal(out.unrung, true);
  assert.equal(out.quieted, false);
  assert.ok(ALARM.has("unrung"));
  assert.equal(IDLE_WORD, "unrung");
});

test("seeded unrung scores unrung", () => {
  const out = decide(seedUnrung());
  assert.equal(out.verdict, "unrung");
  assert.equal(out.unrung, true);
  assert.ok(out.chips.includes("unrung"));
  assert.ok(out.chips.includes("taskstop-silent"));
  assert.ok(out.chips.includes("exit-stop-silent"));
});

test("quieted seed is a hold", () => {
  const out = decide(seedQuieted());
  assert.equal(out.verdict, "quieted");
  assert.equal(out.quieted, true);
  assert.equal(out.unrung, false);
  assert.ok(HOLD.has(out.verdict));
  assert.equal(SEEDED_WORD, "quieted");
});

test("start-without-stop chip", () => {
  const out = decide({ seed: "start-without-stop", startWithoutStop: true });
  assert.equal(out.verdict, "start-without-stop");
  assert.equal(out.unrung, true);
  assert.match(out.reasons.join(" "), /SubagentStart/);
  assert.match(out.reasons.join(" "), /SubagentStop/);
});

test("taskstop-silent chip", () => {
  const out = decide({ seed: "taskstop-silent", taskstopSilent: true });
  assert.equal(out.verdict, "taskstop-silent");
  assert.match(out.reasons.join(" "), /TaskStop/);
  assert.match(out.reasons.join(" "), /a7e17cab67db81d3b/);
});

test("exit-stop-silent chip", () => {
  const out = decide({ seed: "exit-stop-silent", exitStopSilent: true });
  assert.equal(out.verdict, "exit-stop-silent");
  assert.match(out.reasons.join(" "), /Exit and stop tasks/);
  assert.match(out.reasons.join(" "), /aeb8c19d42bf9982c/);
});

test("control-completion-tolls chip", () => {
  const out = decide({ seed: "control-completion-tolls", controlTolls: true });
  assert.equal(out.verdict, "control-completion-tolls");
  assert.match(out.reasons.join(" "), /last_assistant_message/);
  assert.match(out.reasons.join(" "), /a407d56a2f914aea2/);
});

test("debug-file-missing chip", () => {
  const out = decide({ seed: "debug-file-missing", debugFileMissing: true });
  assert.equal(out.verdict, "debug-file-missing");
  assert.match(out.reasons.join(" "), /--debug-file/);
  assert.match(out.reasons.join(" "), /SubagentStop/);
});

test("registry-cleared chip", () => {
  const out = decide({ seed: "registry-cleared", registryCleared: true });
  assert.equal(out.verdict, "registry-cleared");
  assert.match(out.reasons.join(" "), /registry/);
  assert.match(out.reasons.join(" "), /background_tasks/);
});

test("pairing-drift chip", () => {
  const out = decide({ seed: "pairing-drift", pairingDrift: true });
  assert.equal(out.verdict, "pairing-drift");
  assert.match(out.reasons.join(" "), /pairing/);
  assert.match(out.reasons.join(" "), /drift after every kill/);
});

test("cousins cite-only", () => {
  const out = decide({
    seed: "cousins",
    cousinsCiteOnly: [78463, 44971, 82249]
  });
  assert.equal(out.verdict, "cousins");
  assert.match(out.reasons.join(" "), /#78463/);
  assert.match(out.reasons.join(" "), /#44971/);
  assert.match(out.reasons.join(" "), /#82249/);
  assert.match(out.reasons.join(" "), /Cribble/);
  assert.match(out.reasons.join(" "), /Springe/);
});

test("has-clear-repro chip from labels", () => {
  const out = decide({ seed: "has-clear-repro", hasClearRepro: true });
  assert.equal(out.verdict, "has-clear-repro");
  assert.match(out.reasons.join(" "), /has-clear-repro/);
  assert.match(out.reasons.join(" "), /has repro/);
});

test("analyze / score / handle / seeds / scoreFields", () => {
  const idle = analyze({});
  assert.equal(idle.verdict, "unrung");
  assert.equal(score(seedQuieted()).verdict, "quieted");
  assert.equal(handle('{"seed":"unrung","unrung":true}').verdict, "unrung");
  assert.equal(handle({ seed: "quieted", quieted: true }).verdict, "quieted");
  const bag = seeds();
  assert.equal(decide(bag.unrung).verdict, "unrung");
  assert.equal(decide(bag.quieted).verdict, "quieted");
  assert.equal(scoreFields(seedUnrung()).unrung, true);
});

test("fingerprint and signals detect quietus facts", () => {
  assert.equal(
    unrungSignal("ALARM: quietus unrung; never rings; hook silent; no SubagentStop"),
    true
  );
  assert.equal(
    quietedSignal("quietus already quieted; every kill path rings; knell settled"),
    true
  );
  assert.equal(
    startWithoutStopSignal("start-without-stop without a matching SubagentStop pairing should be 1:1"),
    true
  );
  assert.equal(taskstopSilentSignal("taskstop-silent TaskStop a7e17cab67db81d3b"), true);
  assert.equal(exitStopSilentSignal("exit-stop-silent Exit and stop tasks aeb8c19d42bf9982c"), true);
  assert.equal(
    controlTollsSignal("control-completion-tolls last_assistant_message a407d56a2f914aea2 last:done"),
    true
  );
  assert.equal(debugFileMissingSignal("debug-file-missing --debug-file no SubagentStop line"), true);
  assert.equal(
    registryClearedSignal("registry-cleared bg:[] background_tasks as [] agent gone from registry"),
    true
  );
  assert.equal(
    pairingDriftSignal("pairing-drift pairing SubagentStart drifts after every kill"),
    true
  );
  const hits = signals(seedUnrung());
  assert.equal(hits.unrung || hits.taskstopSilent || hits.exitStopSilent, true);
  const print = fingerprint(seedUnrung());
  assert.equal(print.taskstopSilent, true);
  assert.equal(print.unrungHit, true);
});

test("fingerprint scores quieted clean knell-settled path", () => {
  const print = fingerprint(seedQuieted());
  assert.equal(print.quietedClean, true);
  assert.equal(print.unrungHit, false);
  const out = decide({ ...seedQuieted(), seed: "quieted" });
  assert.equal(out.quieted, true);
  assert.equal(out.verdict, "quieted");
  assert.equal(quietusQuieted(seedQuieted()), true);
  assert.equal(quietusQuieted(seedUnrung()), false);
});

test("classify idle vs hold flags", () => {
  const idle = classify(seedUnrung());
  assert.equal(idle.unrung, true);
  const hold = classify(seedQuieted());
  assert.equal(hold.quieted, true);
});

test("pathRings encodes TaskStop silent / Exit-stop silent / control tolls", () => {
  assert.equal(pathRings("taskstop"), false);
  assert.equal(pathRings("exit-stop"), false);
  assert.equal(pathRings("control"), true);
  assert.equal(pathRings("unknown"), null);
});

test("kill paths are taskstop / exit-stop / control", () => {
  assert.ok(KILL_PATHS.length === 3);
  assert.ok(KILL_PATHS.some((row) => row.id === "taskstop" && row.rings === false));
  assert.ok(KILL_PATHS.some((row) => row.id === "exit-stop" && row.rings === false));
  assert.ok(KILL_PATHS.some((row) => row.id === "control" && row.rings === true));
});

test("hook log encodes the published interactive session", () => {
  assert.ok(HOOK_LOG.length >= 8);
  assert.equal(HOOK_LOG[0].ev, "SubagentStart");
  assert.equal(HOOK_LOG[0].agent_id, "a7e17cab67db81d3b");
  const controlStop = HOOK_LOG.find((row) => row.ev === "SubagentStop");
  assert.ok(controlStop);
  assert.equal(controlStop.agent_id, "a407d56a2f914aea2");
  assert.equal(controlStop.last, "done");
  const exitStart = HOOK_LOG.find((row) => row.agent_id === "aeb8c19d42bf9982c");
  assert.ok(exitStart);
  assert.equal(exitStart.ev, "SubagentStart");
});

test("measured facts from #92716", () => {
  assert.equal(MEASURED.issue, 92716);
  assert.equal(MEASURED.state, "open");
  assert.deepEqual(MEASURED.labels, [
    "bug",
    "has repro",
    "platform:macos",
    "area:hooks",
    "area:agents"
  ]);
  assert.equal(MEASURED.filed, "2026-09-07T18:55:26Z");
  assert.equal(MEASURED.updated, "2026-09-07T18:56:30Z");
  assert.equal(MEASURED.reporter, "pszypowicz");
  assert.equal(MEASURED.comments, 0);
  assert.equal(MEASURED.os, "macOS 26.6");
  assert.equal(MEASURED.platform, "macos");
  assert.equal(MEASURED.claudeCodeLive, "2.1.261");
  assert.equal(MEASURED.model, "Haiku 4.5");
  assert.equal(MEASURED.parentAndSubagentSameModel, true);
  assert.equal(MEASURED.reproducedHeadless, true);
  assert.equal(MEASURED.reproducedInteractive, true);
  assert.equal(MEASURED.taskstopSubagentStop, false);
  assert.equal(MEASURED.exitStopSubagentStop, false);
  assert.equal(MEASURED.controlSubagentStop, true);
  assert.equal(MEASURED.controlLastAssistantMessage, "done");
  assert.equal(MEASURED.debugFileHasKillSubagentStop, false);
  assert.equal(MEASURED.registryClearedAfterTaskStop, true);
  assert.equal(MEASURED.pairingDrifts, true);
  assert.equal(IDLE_WORD, "unrung");
  assert.equal(SEEDED_WORD, "quieted");
});

test("HOLD is quieted; ALARM is unrung family", () => {
  assert.ok(HOLD.has("quieted"));
  assert.equal(ALARM.has("quieted"), false);
  for (const chip of [
    "unrung",
    "start-without-stop",
    "taskstop-silent",
    "exit-stop-silent",
    "control-completion-tolls",
    "debug-file-missing",
    "registry-cleared",
    "pairing-drift",
    "cousins",
    "has-clear-repro"
  ]) {
    assert.ok(ALARM.has(chip), chip);
  }
  assert.deepEqual(CHIPS, VERDICTS);
  assert.deepEqual(VERDICTS, [
    "unrung",
    "quieted",
    "start-without-stop",
    "taskstop-silent",
    "exit-stop-silent",
    "control-completion-tolls",
    "debug-file-missing",
    "registry-cleared",
    "pairing-drift",
    "cousins",
    "has-clear-repro"
  ]);
});

test("cousins table is cite-only 78463 / 44971 / 82249", () => {
  assert.deepEqual(
    COUSINS.map((c) => c.id),
    [78463, 44971, 82249]
  );
  assert.ok(COUSINS.some((c) => c.id === 82249 && /DIFFERENT/i.test(c.note)));
});

test("fixtures encode issue facts and score their seeds", () => {
  const files = [
    "unrung.json",
    "quieted.json",
    "92716.json",
    "start-without-stop.json",
    "taskstop-silent.json",
    "exit-stop-silent.json",
    "control-completion-tolls.json",
    "debug-file-missing.json",
    "registry-cleared.json",
    "pairing-drift.json",
    "cousins.json",
    "fixtures.json",
    "has-clear-repro.json"
  ];
  for (const name of files) {
    const raw = readFileSync(join(root, "data", name), "utf8");
    assert.match(raw, /92716|quietus|unrung|quieted/i);
    if (name !== "fixtures.json") {
      const fixture = JSON.parse(raw);
      const out = decide(fixture);
      assert.ok(VERDICTS.includes(out.verdict), `${name} → ${out.verdict}`);
    }
  }
  const index = JSON.parse(readFileSync(join(root, "data", "fixtures.json"), "utf8"));
  assert.equal(index.narrativeNotFixture.idle, "unrung");
  assert.equal(index.narrativeNotFixture.seeded, "quieted");
  assert.equal(index.narrativeNotFixture.noLiveSessions, true);
  assert.equal(index.narrativeNotFixture.noPayloads, true);
  assert.equal(index.narrativeNotFixture.noSecrets, true);
  assert.ok(index.narrativeNotFixture.labels.includes("has repro"));
  assert.ok(index.narrativeNotFixture.labels.includes("area:hooks"));
  assert.ok(index.narrativeNotFixture.labels.includes("area:agents"));
  const listed = readdirSync(join(root, "data"));
  assert.ok(listed.includes("README.md"));
});

test("living page is a registrar quietus ledger, not a clone", () => {
  assert.match(page, /Cardo/);
  assert.match(page, /Public Sans/);
  assert.match(page, /Fragment Mono/);
  assert.doesNotMatch(page, /Young Serif/);
  assert.doesNotMatch(page, /Karla/);
  assert.doesNotMatch(page, /IBM Plex Mono/);
  assert.doesNotMatch(page, /Bodoni Moda/);
  assert.doesNotMatch(page, /Nunito Sans/);
  assert.doesNotMatch(page, /Oswald/);
  assert.doesNotMatch(page, /Source Sans 3/);
  assert.doesNotMatch(page, /Newsreader/);
  assert.doesNotMatch(page, /Figtree/);
  assert.doesNotMatch(page, /Big Shoulders Display/);
  assert.doesNotMatch(page, /Roboto Mono/);
  assert.doesNotMatch(page, /Petrona/);
  assert.doesNotMatch(page, /Lexend/);
  assert.doesNotMatch(page, /Azeret Mono/);
  assert.doesNotMatch(page, /Instrument Serif/);
  assert.doesNotMatch(page, /Plus Jakarta Sans/);
  assert.doesNotMatch(page, /Fraunces/);
  assert.doesNotMatch(page, /JetBrains Mono/);
  assert.match(page, /unrung/);
  assert.match(page, /quieted/);
  assert.match(page, /#92716/);
  assert.match(page, /Quietus/);
  assert.match(page, /embed/);
  assert.match(page, /\?embed=1/);
  assert.match(page, /05:50 \/ hermes catalog #211 \/ #92716/);
  assert.match(page, /Score the quietus/);
  assert.match(page, /Pin idle unrung/);
  assert.match(page, /Pin seeded quieted/);
  assert.match(page, /Admit quieted/);
  assert.match(page, /Load fixtures/);
  assert.match(page, /Reset to quieted/);
  assert.match(page, /Toll the knell/);
  assert.match(page, /Leave the ledger unrung/);
  assert.match(page, /quietus|registrar|knell|ledger|UNRUNG|QUIETED/i);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /78463/);
  assert.match(page, /44971/);
  assert.match(page, /82249/);
  assert.match(page, /SubagentStop/);
  assert.match(page, /TaskStop/);
  assert.match(page, /Exit and stop tasks/);
  assert.match(page, /last_assistant_message/);
});

test("page stays off neighboring UIs and prior idle words", () => {
  assert.doesNotMatch(page, /miller's cribble/i);
  assert.doesNotMatch(page, /flour loft/i);
  assert.doesNotMatch(page, /oak cribble/i);
  assert.doesNotMatch(page, /iron wire mesh/i);
  assert.doesNotMatch(page, /trapper's springe/i);
  assert.doesNotMatch(page, /snare-setter/i);
  assert.doesNotMatch(page, /pier gangway/i);
  assert.doesNotMatch(page, /freight waybill/i);
  assert.doesNotMatch(page, /snatch-block/i);
  assert.doesNotMatch(page, /brass speakpipe/i);
  assert.doesNotMatch(page, /phosphor persistence/i);
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
});

test("README anti-clone encodes the quietus thesis", () => {
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /SubagentStop/);
  assert.match(readme, /TaskStop/);
  assert.match(readme, /pszypowicz/);
  assert.match(readme, /#78463/);
  assert.match(readme, /#44971/);
  assert.match(readme, /#82249/);
  assert.match(readme, /How to score/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/quietus\//);
  assert.match(readme, /Score unrung or admit quieted/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /NOT Cribble/);
  assert.match(readme, /NOT Springe/);
  assert.match(hookReadme, /unrung/);
  assert.match(hookReadme, /quieted/);
  assert.match(dataReadme, /unrung/);
  assert.match(dataReadme, /quieted/);
});
