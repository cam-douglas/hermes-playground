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
  seedReceipted,
  seedLost,
  seedFiled,
  fingerprint,
  signals,
  receiptedSignal,
  lostSignal,
  filedSignal,
  dispatchOkNoPersistSignal,
  postToolUseOrchestrationSignal,
  worktreeTransitionSignal,
  printSdkOkSignal,
  asyncHookMitigationSignal,
  bashAndPowershellSignal,
  letterFiled,
  letterWasLost,
  dispatchEndedOk,
  toolResultPersisted,
  hooksBlocking,
  asyncHookBypasses,
  printSdkDelivers,
  bothShellsHit,
  HOLD,
  ALARM,
  MEASURED,
  CHIPS,
  VERDICTS,
  COUSINS,
  TRAY_LEDGER,
  REPRO_TABLE,
  DISPATCH_OK,
  HOOKS_AB,
  FLOW,
  IDLE_WORD,
  SEEDED_WORD,
  ADMIT_WORD
} from "./deadletter.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const page = readFileSync(join(root, "index.html"), "utf8");
const readme = readFileSync(join(root, "README.md"), "utf8");
const hookReadme = readFileSync(join(root, "hook", "README.md"), "utf8");
const dataReadme = readFileSync(join(root, "data", "README.md"), "utf8");

test("primary 90049 fixture scores lost", () => {
  const primary = JSON.parse(readFileSync(join(root, "data", "90049.json"), "utf8"));
  const out = decide(primary);
  assert.equal(out.verdict, "lost");
  assert.equal(out.lost, true);
  assert.ok(out.chips.includes("lost"));
  assert.ok(ALARM.has(out.verdict));
});

test("empty / idle probe is receipted", () => {
  const out = decide({});
  assert.equal(out.verdict, "receipted");
  assert.equal(out.receipted, true);
  assert.equal(out.lost, false);
  assert.ok(HOLD.has("receipted"));
  assert.equal(IDLE_WORD, "receipted");
});

test("receipted fixture is hold", () => {
  const idle = JSON.parse(readFileSync(join(root, "data", "receipted.json"), "utf8"));
  const out = decide(idle);
  assert.equal(out.verdict, "receipted");
  assert.equal(out.receipted, true);
  assert.ok(HOLD.has(out.verdict));
});

test("lost fixture scores lost", () => {
  const out = decide(seedLost());
  assert.equal(out.verdict, "lost");
  assert.equal(out.lost, true);
  assert.ok(out.chips.includes("lost"));
  assert.ok(out.chips.includes("dispatch-ok-no-persist"));
  assert.ok(ALARM.has(out.verdict));
});

test("filed seed is a hold", () => {
  const out = decide(seedFiled());
  assert.equal(out.verdict, "filed");
  assert.equal(out.filed, true);
  assert.equal(out.lost, false);
  assert.ok(HOLD.has(out.verdict));
  assert.equal(SEEDED_WORD, "lost");
  assert.equal(ADMIT_WORD, "filed");
});

test("receipted seed is idle hold", () => {
  const out = decide(seedReceipted());
  assert.equal(out.verdict, "receipted");
  assert.equal(out.receipted, true);
  assert.ok(HOLD.has("receipted"));
});

test("dispatch-ok-no-persist chip", () => {
  const out = decide({ seed: "dispatch-ok-no-persist", dispatchOkNoPersist: true });
  assert.equal(out.verdict, "dispatch-ok-no-persist");
  assert.equal(out.lost, true);
  assert.match(out.reasons.join(" "), /outcome=ok/);
  assert.match(out.reasons.join(" "), /no matching tool_result/);
});

test("posttooluse-orchestration chip", () => {
  const out = decide({ seed: "posttooluse-orchestration", postToolUseOrchestration: true });
  assert.equal(out.verdict, "posttooluse-orchestration");
  assert.match(out.reasons.join(" "), /await tool\.call/);
  assert.match(out.reasons.join(" "), /PostToolUse/);
});

test("worktree-transition chip", () => {
  const out = decide({ seed: "worktree-transition", worktreeTransition: true });
  assert.equal(out.verdict, "worktree-transition");
  assert.match(out.reasons.join(" "), /EnterWorktree/);
  assert.match(out.reasons.join(" "), /ExitWorktree/);
});

test("print-sdk-ok chip", () => {
  const out = decide({ seed: "print-sdk-ok", printSdkOk: true });
  assert.equal(out.verdict, "print-sdk-ok");
  assert.match(out.reasons.join(" "), /claude -p/);
  assert.match(out.reasons.join(" "), /sdk-cli/);
});

test("async-hook-mitigation chip", () => {
  const out = decide({ seed: "async-hook-mitigation", asyncHookMitigation: true });
  assert.equal(out.verdict, "async-hook-mitigation");
  assert.match(out.reasons.join(" "), /async:true/);
  assert.match(out.reasons.join(" "), /async_hook_33956/);
});

test("bash-and-powershell chip", () => {
  const out = decide({ seed: "bash-and-powershell", bashAndPowershell: true });
  assert.equal(out.verdict, "bash-and-powershell");
  assert.match(out.reasons.join(" "), /not Bash-specific/);
  assert.match(out.reasons.join(" "), /PowerShell/);
});

test("cousins cite-only stale neighbourhood", () => {
  const out = decide({
    seed: "cousins",
    cousinsCiteOnly: COUSINS
  });
  assert.equal(out.verdict, "cousins");
  assert.match(out.reasons.join(" "), /84154/);
  assert.match(out.reasons.join(" "), /90049/);
  assert.equal(COUSINS.length, 1);
  assert.equal(COUSINS[0].state, "closed");
  assert.equal(COUSINS[0].id, 84154);
});

test("has-clear-repro chip from labels", () => {
  const out = decide({ seed: "has-clear-repro", hasClearRepro: true });
  assert.equal(out.verdict, "has-clear-repro");
  assert.match(out.reasons.join(" "), /has-clear-repro/);
  assert.match(out.reasons.join(" "), /has repro/);
});

test("analyze / score / handle / seeds / scoreFields", () => {
  const idle = analyze({});
  assert.equal(idle.verdict, "receipted");
  assert.equal(score(seedFiled()).verdict, "filed");
  assert.equal(handle('{"seed":"lost","lost":true}').verdict, "lost");
  assert.equal(handle({ seed: "filed", filed: true }).verdict, "filed");
  const bag = seeds();
  assert.equal(decide(bag.receipted).verdict, "receipted");
  assert.equal(decide(bag.lost).verdict, "lost");
  assert.equal(decide(bag.filed).verdict, "filed");
  assert.equal(scoreFields(seedLost()).lost, true);
});

test("fingerprint and signals detect deadletter facts", () => {
  assert.equal(
    receiptedSignal("idle pigeonhole is receipted; pin idle receipted; completed shell tool_results stay receipted"),
    true
  );
  assert.equal(
    lostSignal("PostToolUse orchestration loses the result after tool_dispatch_end; transcript ends at tool_use; no matching tool_result"),
    true
  );
  assert.equal(
    filedSignal("already filed; closes/consumes the PostToolUse stream; completed tool_result is filed"),
    true
  );
  assert.equal(dispatchOkNoPersistSignal("dispatch-ok-no-persist tool_dispatch_end outcome=ok no matching tool_result persisted"), true);
  assert.equal(postToolUseOrchestrationSignal("posttooluse-orchestration await tool.call async PostToolUse iteration construct/push tool_result"), true);
  assert.equal(worktreeTransitionSignal("worktree-transition EnterWorktree ExitWorktree session start"), true);
  assert.equal(printSdkOkSignal("print-sdk-ok cc_entrypoint=cli claude -p: succeeds"), true);
  assert.equal(asyncHookMitigationSignal("async-hook-mitigation async:true PostToolUse async_hook_33956"), true);
  assert.equal(bashAndPowershellSignal("bash-and-powershell not Bash-specific native PowerShell"), true);
  const hits = signals(seedLost());
  assert.equal(hits.lost || hits.dispatchOkNoPersist || hits.postToolUseOrchestration, true);
  const print = fingerprint(seedLost());
  assert.equal(print.lostHit, true);
  assert.equal(print.letterLost, true);
});

test("fingerprint scores filed letter path", () => {
  const print = fingerprint(seedFiled());
  assert.equal(print.filedClean, true);
  assert.equal(print.lostHit, false);
  const out = decide({ ...seedFiled(), seed: "filed" });
  assert.equal(out.filed, true);
  assert.equal(out.verdict, "filed");
  assert.equal(letterFiled(seedFiled()), true);
  assert.equal(letterFiled(seedLost()), false);
});

test("classify idle vs hold flags", () => {
  const alarm = classify(seedLost());
  assert.equal(alarm.lost, true);
  const hold = classify(seedFiled());
  assert.equal(hold.filed, true);
  const idle = classify(seedReceipted());
  assert.equal(idle.receipted, true);
});

test("helpers encode dispatch-ok + missing persist + A/B", () => {
  assert.equal(letterWasLost(seedLost()), true);
  assert.equal(letterWasLost(seedReceipted()), false);
  assert.equal(letterWasLost({ lost: true }), true);
  assert.equal(dispatchEndedOk(seedLost()), true);
  assert.equal(dispatchEndedOk({ dispatch: { outcome: "ok" } }), true);
  assert.equal(toolResultPersisted(seedLost()), false);
  assert.equal(toolResultPersisted(seedReceipted()), true);
  assert.equal(hooksBlocking({ postToolUseOrchestration: true }), true);
  assert.equal(hooksBlocking({ async: true }), false);
  assert.equal(asyncHookBypasses({ asyncHookMitigation: true }), true);
  assert.equal(printSdkDelivers({ printSdkOk: true }), true);
  assert.equal(bothShellsHit({ shells: ["Bash", "PowerShell"] }), true);
  assert.equal(DISPATCH_OK.outcome, "ok");
  assert.equal(DISPATCH_OK.durationMs, 3158);
  assert.equal(DISPATCH_OK.toolUseId, "toolu_01J7bPw5ZW4YSjTkJRCwtZDM");
  assert.match(HOOKS_AB.without, /tool_result persisted/);
  assert.match(HOOKS_AB.with, /no tool_result/);
  assert.equal(HOOKS_AB.duplicatesNotRequired, true);
  assert.deepEqual(FLOW, [
    "await tool.call",
    "tool_dispatch_end outcome=ok",
    "async PostToolUse iteration",
    "construct/push tool_result"
  ]);
});

test("tray ledger encodes the issue split", () => {
  assert.ok(TRAY_LEDGER.some((row) => row.id === "dispatch" && /outcome=ok/i.test(row.tally)));
  assert.ok(TRAY_LEDGER.some((row) => row.id === "tray" && /tool_use/i.test(row.tally)));
  assert.ok(TRAY_LEDGER.some((row) => row.id === "hooks" && /async:true/i.test(row.tally)));
  assert.ok(TRAY_LEDGER.length === 3);
  assert.equal(REPRO_TABLE.length, 4);
  assert.equal(REPRO_TABLE[0].mark, "EnterWorktree");
  assert.equal(REPRO_TABLE[3].mark, "no tool_result");
});

test("measured facts from #90049", () => {
  assert.equal(MEASURED.issue, 90049);
  assert.equal(MEASURED.state, "open");
  assert.deepEqual(MEASURED.labels, ["bug", "has repro", "platform:windows", "area:bash"]);
  assert.equal(MEASURED.filed, "2026-08-27T09:59:22Z");
  assert.equal(MEASURED.reporter, "simon-bauer-sonarsource");
  assert.match(MEASURED.versions, /2\.1\.247/);
  assert.match(MEASURED.versions, /2\.1\.263/);
  assert.match(MEASURED.os, /Windows 11/);
  assert.equal(MEASURED.originalDiagnosisIncorrect, true);
  assert.equal(IDLE_WORD, "receipted");
  assert.equal(SEEDED_WORD, "lost");
  assert.equal(ADMIT_WORD, "filed");
});

test("HOLD is receipted/filed; ALARM is lost family", () => {
  assert.ok(HOLD.has("receipted"));
  assert.ok(HOLD.has("filed"));
  assert.equal(ALARM.has("receipted"), false);
  assert.equal(ALARM.has("filed"), false);
  for (const chip of [
    "lost",
    "dispatch-ok-no-persist",
    "posttooluse-orchestration",
    "worktree-transition",
    "print-sdk-ok",
    "async-hook-mitigation",
    "bash-and-powershell",
    "cousins",
    "has-clear-repro"
  ]) {
    assert.ok(ALARM.has(chip), chip);
  }
  assert.deepEqual(CHIPS, VERDICTS);
  assert.deepEqual(VERDICTS, [
    "receipted",
    "lost",
    "filed",
    "dispatch-ok-no-persist",
    "posttooluse-orchestration",
    "worktree-transition",
    "print-sdk-ok",
    "async-hook-mitigation",
    "bash-and-powershell",
    "has-clear-repro",
    "cousins"
  ]);
});

test("cousins table cites stale prior report only", () => {
  assert.equal(COUSINS.length, 1);
  assert.ok(COUSINS.some((c) => c.id === 84154 && c.state === "closed"));
});

test("fixtures encode issue facts and score their seeds", () => {
  const files = [
    "receipted.json",
    "lost.json",
    "filed.json",
    "90049.json",
    "dispatch-ok-no-persist.json",
    "posttooluse-orchestration.json",
    "worktree-transition.json",
    "print-sdk-ok.json",
    "async-hook-mitigation.json",
    "bash-and-powershell.json",
    "cousins.json",
    "fixtures.json",
    "has-clear-repro.json"
  ];
  for (const name of files) {
    const raw = readFileSync(join(root, "data", name), "utf8");
    assert.match(raw, /90049|deadletter|receipted|lost|filed/i);
    if (name !== "fixtures.json") {
      const fixture = JSON.parse(raw);
      const out = decide(fixture);
      assert.ok(VERDICTS.includes(out.verdict), `${name} → ${out.verdict}`);
    }
  }
  const index = JSON.parse(readFileSync(join(root, "data", "fixtures.json"), "utf8"));
  assert.equal(index.narrativeNotFixture.idle, "receipted");
  assert.equal(index.narrativeNotFixture.seeded, "lost");
  assert.equal(index.narrativeNotFixture.noLiveSessions, true);
  assert.equal(index.narrativeNotFixture.noPayloads, true);
  assert.equal(index.narrativeNotFixture.noSecrets, true);
  assert.ok(index.narrativeNotFixture.labels.includes("has repro"));
  assert.ok(index.narrativeNotFixture.labels.includes("platform:windows"));
  const listed = readdirSync(join(root, "data"));
  assert.ok(listed.includes("README.md"));
});

test("living page is a postal dead-letter desk, not a clone", () => {
  assert.match(page, /Newsreader/);
  assert.match(page, /Figtree/);
  assert.match(page, /JetBrains Mono/);
  assert.doesNotMatch(page, /Space Grotesk/);
  assert.doesNotMatch(page, /Manrope/);
  assert.doesNotMatch(page, /IBM Plex Mono/);
  assert.doesNotMatch(page, /Zilla Slab/);
  assert.doesNotMatch(page, /Atkinson Hyperlegible/);
  assert.doesNotMatch(page, /Fraunces/);
  assert.doesNotMatch(page, /Outfit/);
  assert.doesNotMatch(page, /Petrona/);
  assert.doesNotMatch(page, /EB Garamond/);
  assert.doesNotMatch(page, /Barlow/);
  assert.doesNotMatch(page, /Source Code Pro/);
  assert.doesNotMatch(page, /Lora/);
  assert.doesNotMatch(page, /Plus Jakarta/);
  assert.doesNotMatch(page, /Cousine/);
  assert.doesNotMatch(page, /Karla/);
  assert.doesNotMatch(page, /Literata/);
  assert.doesNotMatch(page, /Red Hat Text/);
  assert.doesNotMatch(page, /Fira Code/);
  assert.doesNotMatch(page, /DM Serif Display/);
  assert.doesNotMatch(page, /Commissioner/);
  assert.doesNotMatch(page, /Azeret/);
  assert.doesNotMatch(page, /Instrument Serif/);
  assert.doesNotMatch(page, /Playfair/);
  assert.doesNotMatch(page, /DM Sans/);
  assert.match(page, /\blost\b/);
  assert.match(page, /filed/);
  assert.match(page, /\breceipted\b/);
  assert.match(page, /#90049/);
  assert.match(page, /Deadletter/);
  assert.match(page, /embed/);
  assert.match(page, /\?embed=1/);
  assert.match(page, /19:50 \/ hermes catalog #225 \/ #90049/);
  assert.match(page, /Score lost/);
  assert.match(page, /Admit filed/);
  assert.match(page, /Pin idle receipted/);
  assert.match(page, /Reset to receipted/);
  assert.match(page, /tool_dispatch_end/);
  assert.match(page, /PostToolUse/);
  assert.match(page, /pigeonhole/);
  assert.match(page, /envelope/);
  assert.match(page, /undeliverable/);
  assert.match(page, /cousin-not-primary/);
});

test("page stays off neighboring UIs and prior idle words", () => {
  assert.doesNotMatch(page, /twin-nameplate/i);
  assert.doesNotMatch(page, /lexicographer/i);
  assert.doesNotMatch(page, /iron-gall/i);
  assert.doesNotMatch(page, /marble cistern/i);
  assert.doesNotMatch(page, /water-clock/i);
  assert.doesNotMatch(page, /iron sconce/i);
  assert.doesNotMatch(page, /rush-pith/i);
  assert.doesNotMatch(page, /ivory-and-ebony/i);
  assert.doesNotMatch(page, /stevedore's dunnage/i);
  assert.doesNotMatch(page, /locksmith's espagnolette/i);
  assert.doesNotMatch(page, /CRT phosphor/i);
  assert.doesNotMatch(page, /hairline-rule/i);
  assert.doesNotMatch(page, /compositor/i);
  assert.doesNotMatch(page, /zinc chase/i);
  assert.doesNotMatch(page, /cold-solder/i);
  assert.doesNotMatch(page, /FR4/i);
  assert.doesNotMatch(page, /\bfused\b/);
  assert.doesNotMatch(page, /\bdry\b/);
  assert.doesNotMatch(page, /\bbonded\b/);
  assert.doesNotMatch(page, /\bmatched\b/);
  assert.doesNotMatch(page, /\borphaned\b/);
  assert.doesNotMatch(page, /\bkeyed\b/);
  assert.doesNotMatch(page, /\bdripping\b/);
  assert.doesNotMatch(page, /\barrested\b/);
  assert.doesNotMatch(page, /\bcredited\b/);
  assert.doesNotMatch(page, /\bchorded\b/);
  assert.doesNotMatch(page, /\bflattened\b/);
  assert.doesNotMatch(page, /\bmeshed\b/);
  assert.doesNotMatch(page, /\bpiped\b/);
  assert.doesNotMatch(page, /\bswallowed\b/);
  assert.doesNotMatch(page, /\bunbound\b/);
  assert.doesNotMatch(page, /\bberthed\b/);
  assert.doesNotMatch(page, /\blean\b/);
  assert.doesNotMatch(page, /\battentive\b/);
  assert.doesNotMatch(page, /\bwaived\b/);
  assert.doesNotMatch(page, /\bbricked\b/);
  assert.doesNotMatch(page, /\bunrung\b/);
  assert.doesNotMatch(page, /\bechoed\b/);
  assert.doesNotMatch(page, /\bladen\b/);
  assert.doesNotMatch(page, /\bdeaf\b/);
  assert.doesNotMatch(page, /\bshed\b/);
  assert.doesNotMatch(page, /\bremounted\b/);
  assert.doesNotMatch(page, /\brefused\b/);
  assert.doesNotMatch(page, /\bimprinted\b/);
  assert.doesNotMatch(page, /\bscored\b/);
  assert.doesNotMatch(page, /\bvoided\b/);
  assert.doesNotMatch(page, /\bbanked\b/);
  assert.doesNotMatch(page, /\brewritten\b/);
  assert.doesNotMatch(page, /\bseeded\b/);
  assert.doesNotMatch(page, /\bdrained\b/);
  assert.doesNotMatch(page, /\bsnuffed\b/);
  assert.doesNotMatch(page, /\btenured\b/);
  assert.doesNotMatch(page, /\bleaked\b/);
  assert.doesNotMatch(page, /\bbound\b/);
});

test("README anti-clone encodes the deadletter thesis", () => {
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /tool_dispatch_end/);
  assert.match(readme, /PostToolUse/);
  assert.match(readme, /How to score/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/deadletter\//);
  assert.match(readme, /Score lost or admit filed/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /NOT Dryjoint/);
  assert.match(readme, /NOT Dinkus/);
  assert.match(readme, /NOT Homonym/);
  assert.match(readme, /NOT Clepsydra/);
  assert.match(readme, /NOT Rushlight/);
  assert.match(readme, /NOT Letoff/);
  assert.match(readme, /#84154/);
  assert.match(readme, /#88418/);
  assert.match(readme, /#89395/);
  assert.match(hookReadme, /receipted/);
  assert.match(hookReadme, /lost/);
  assert.match(hookReadme, /filed/);
  assert.match(dataReadme, /receipted/);
  assert.match(dataReadme, /lost/);
  assert.match(dataReadme, /filed/);
});
