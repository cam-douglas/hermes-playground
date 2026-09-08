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
  seedAttentive,
  seedDeaf,
  seedRemounted,
  fingerprint,
  signals,
  attentiveSignal,
  deafSignal,
  remountedSignal,
  blurDeafSignal,
  ancestorLiveSignal,
  singleDeadendSignal,
  remountRecoversSignal,
  isDisabledSignatureSignal,
  focusLostSignal,
  folioRemounted,
  keyIsDead,
  HOLD,
  ALARM,
  MEASURED,
  CHIPS,
  VERDICTS,
  COUSINS,
  KEY_MATRIX,
  QUESTION_PANES,
  IDLE_WORD,
  SEEDED_WORD
} from "./espagnolette.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const page = readFileSync(join(root, "index.html"), "utf8");
const readme = readFileSync(join(root, "README.md"), "utf8");
const hookReadme = readFileSync(join(root, "hook", "README.md"), "utf8");
const dataReadme = readFileSync(join(root, "data", "README.md"), "utf8");

test("primary 92694 fixture scores deaf", () => {
  const primary = JSON.parse(readFileSync(join(root, "data", "92694.json"), "utf8"));
  const out = decide(primary);
  assert.equal(out.verdict, "deaf");
  assert.equal(out.deaf, true);
  assert.ok(out.chips.includes("deaf"));
  assert.ok(ALARM.has(out.verdict));
});

test("empty / idle probe is attentive", () => {
  const out = decide({});
  assert.equal(out.verdict, "attentive");
  assert.equal(out.attentive, true);
  assert.equal(out.deaf, false);
  assert.ok(HOLD.has("attentive"));
  assert.equal(IDLE_WORD, "attentive");
});

test("attentive fixture is hold", () => {
  const idle = JSON.parse(readFileSync(join(root, "data", "attentive.json"), "utf8"));
  const out = decide(idle);
  assert.equal(out.verdict, "attentive");
  assert.equal(out.attentive, true);
  assert.ok(HOLD.has(out.verdict));
});

test("seeded deaf scores deaf", () => {
  const out = decide(seedDeaf());
  assert.equal(out.verdict, "deaf");
  assert.equal(out.deaf, true);
  assert.ok(out.chips.includes("deaf"));
  assert.ok(out.chips.includes("blur-deaf"));
  assert.ok(out.chips.includes("ancestor-live"));
  assert.ok(ALARM.has(out.verdict));
});

test("remounted seed is a hold", () => {
  const out = decide(seedRemounted());
  assert.equal(out.verdict, "remounted");
  assert.equal(out.remounted, true);
  assert.equal(out.deaf, false);
  assert.ok(HOLD.has(out.verdict));
  assert.equal(SEEDED_WORD, "deaf");
});

test("attentive seed is idle hold", () => {
  const out = decide(seedAttentive());
  assert.equal(out.verdict, "attentive");
  assert.equal(out.attentive, true);
  assert.ok(HOLD.has("attentive"));
});

test("blur-deaf chip", () => {
  const out = decide({ seed: "blur-deaf", blurDeaf: true });
  assert.equal(out.verdict, "blur-deaf");
  assert.equal(out.deaf, true);
  assert.match(out.reasons.join(" "), /loses focus and regains/);
  assert.match(out.reasons.join(" "), /sitting idle/);
});

test("ancestor-live chip", () => {
  const out = decide({ seed: "ancestor-live", ancestorLive: true });
  assert.equal(out.verdict, "ancestor-live");
  assert.match(out.reasons.join(" "), /Tab \/ ← \/ →/);
  assert.match(out.reasons.join(" "), /ancestor/);
});

test("single vs multi contrast", () => {
  const single = decide({ seed: "single-deadend", singleDeadend: true });
  const remount = decide({ seed: "remount-recovers", remountRecovers: true });
  assert.equal(single.verdict, "single-deadend");
  assert.equal(remount.verdict, "remount-recovers");
  assert.equal(keyIsDead("↑"), true);
  assert.equal(keyIsDead("Tab"), false);
  assert.equal(QUESTION_PANES.find((c) => c.id === "single").recovery, "none");
  assert.equal(QUESTION_PANES.find((c) => c.id === "multi").recovery, "Tab to Submit then back");
});

test("single-deadend chip", () => {
  const out = decide({ seed: "single-deadend", singleDeadend: true });
  assert.equal(out.verdict, "single-deadend");
  assert.match(out.reasons.join(" "), /single-question/);
  assert.match(out.reasons.join(" "), /Ctrl\+C/);
});

test("remount-recovers chip", () => {
  const out = decide({ seed: "remount-recovers", remountRecovers: true });
  assert.equal(out.verdict, "remount-recovers");
  assert.match(out.reasons.join(" "), /Submit/);
  assert.match(out.reasons.join(" "), /autoFocus/);
});

test("isDisabled-signature chip", () => {
  const out = decide({ seed: "isDisabled-signature", isDisabledSignature: true });
  assert.equal(out.verdict, "isDisabled-signature");
  assert.match(out.reasons.join(" "), /isDisabled/);
  assert.match(out.reasons.join(" "), /handleKeyDown/);
});

test("focus-lost chip", () => {
  const out = decide({ seed: "focus-lost", focusLost: true });
  assert.equal(out.verdict, "focus-lost");
  assert.match(out.reasons.join(" "), /ink focus/);
  assert.match(out.reasons.join(" "), /tabIndex:0/);
});

test("cousins cite-only", () => {
  const out = decide({
    seed: "cousins",
    cousinsCiteOnly: [84489, 86918]
  });
  assert.equal(out.verdict, "cousins");
  assert.match(out.reasons.join(" "), /84489/);
  assert.match(out.reasons.join(" "), /86918/);
  assert.match(out.reasons.join(" "), /options not selectable/);
});

test("has-clear-repro chip from labels", () => {
  const out = decide({ seed: "has-clear-repro", hasClearRepro: true });
  assert.equal(out.verdict, "has-clear-repro");
  assert.match(out.reasons.join(" "), /has-clear-repro/);
  assert.match(out.reasons.join(" "), /has repro/);
});

test("analyze / score / handle / seeds / scoreFields", () => {
  const idle = analyze({});
  assert.equal(idle.verdict, "attentive");
  assert.equal(score(seedRemounted()).verdict, "remounted");
  assert.equal(handle('{"seed":"deaf","deaf":true}').verdict, "deaf");
  assert.equal(handle({ seed: "remounted", remounted: true }).verdict, "remounted");
  const bag = seeds();
  assert.equal(decide(bag.attentive).verdict, "attentive");
  assert.equal(decide(bag.deaf).verdict, "deaf");
  assert.equal(decide(bag.remounted).verdict, "remounted");
  assert.equal(scoreFields(seedDeaf()).deaf, true);
});

test("fingerprint and signals detect espagnolette facts", () => {
  assert.equal(
    attentiveSignal("idle folio is attentive; pin idle attentive; selection keys stay live; caret and footer match a live prompt"),
    true
  );
  assert.equal(
    deafSignal("folio deaf; selection keys are dead; unresponsive to selection"),
    true
  );
  assert.equal(remountedSignal("folio already remounted; remount restores autoFocus"), true);
  assert.equal(blurDeafSignal("blur-deaf loses focus and regains sitting idle"), true);
  assert.equal(
    ancestorLiveSignal("ancestor-live ancestor-owned Tab / ← / → still work ESC[C/D] live"),
    true
  );
  assert.equal(
    singleDeadendSignal("single-deadend single-question no escape except Ctrl+C"),
    true
  );
  assert.equal(
    remountRecoversSignal("remount-recovers Tab across to Submit remount restores"),
    true
  );
  assert.equal(
    isDisabledSignatureSignal("isDisabled-signature isDisabled on the Select select:* and handleKeyDown"),
    true
  );
  assert.equal(
    focusLostSignal("focus-lost lost ink focus tabIndex:0"),
    true
  );
  const hits = signals(seedDeaf());
  assert.equal(hits.deaf || hits.blurDeaf || hits.ancestorLive, true);
  const print = fingerprint(seedDeaf());
  assert.equal(print.blurDeaf, true);
  assert.equal(print.deafHit, true);
});

test("fingerprint scores remounted clean folio path", () => {
  const print = fingerprint(seedRemounted());
  assert.equal(print.remountedClean, true);
  assert.equal(print.deafHit, false);
  const out = decide({ ...seedRemounted(), seed: "remounted" });
  assert.equal(out.remounted, true);
  assert.equal(out.verdict, "remounted");
  assert.equal(folioRemounted(seedRemounted()), true);
  assert.equal(folioRemounted(seedDeaf()), false);
});

test("classify idle vs hold flags", () => {
  const alarm = classify(seedDeaf());
  assert.equal(alarm.deaf, true);
  const hold = classify(seedRemounted());
  assert.equal(hold.remounted, true);
  const idle = classify(seedAttentive());
  assert.equal(idle.attentive, true);
});

test("keyIsDead encodes subtree vs ancestor", () => {
  assert.equal(keyIsDead("↑"), true);
  assert.equal(keyIsDead("↓"), true);
  assert.equal(keyIsDead("Enter"), true);
  assert.equal(keyIsDead("Esc"), true);
  assert.equal(keyIsDead("Tab"), false);
  assert.equal(keyIsDead("←"), false);
  assert.equal(keyIsDead("→"), false);
  assert.equal(keyIsDead("Ctrl+C"), false);
  assert.equal(keyIsDead("unknown"), null);
});

test("key matrix and question panes encode the issue split", () => {
  assert.ok(KEY_MATRIX.some((row) => row.key === "↑" && row.result === "dead"));
  assert.ok(KEY_MATRIX.some((row) => row.key === "Tab" && row.result === "live"));
  assert.ok(QUESTION_PANES.length === 2);
  assert.ok(QUESTION_PANES.some((row) => row.id === "single" && row.recovery === "none"));
  assert.ok(QUESTION_PANES.some((row) => row.id === "multi" && /Tab/.test(row.recovery)));
});

test("measured facts from #92694", () => {
  assert.equal(MEASURED.issue, 92694);
  assert.equal(MEASURED.state, "open");
  assert.deepEqual(MEASURED.labels, [
    "bug",
    "has repro",
    "platform:windows",
    "platform:macos",
    "area:tui"
  ]);
  assert.equal(MEASURED.filed, "2026-09-07T16:06:07Z");
  assert.equal(MEASURED.claude, "Claude Code 2.1.263 (also 2.1.260)");
  assert.match(MEASURED.os, /macOS 15/);
  assert.match(MEASURED.os, /Windows/);
  assert.match(MEASURED.settings, /fullscreen/);
  assert.equal(MEASURED.caretStillDrawn, true);
  assert.equal(MEASURED.footerStillDrawn, true);
  assert.match(MEASURED.footer, /Enter to select/);
  assert.deepEqual(MEASURED.deadKeys, ["↑", "↓", "Enter", "j", "k", "1–9", "Esc"]);
  assert.deepEqual(MEASURED.liveKeys, ["Tab", "←", "→", "Ctrl+C"]);
  assert.equal(MEASURED.notEscapeEncoding, true);
  assert.equal(MEASURED.notWheelScroll, true);
  assert.equal(MEASURED.notStuckChord, true);
  assert.equal(IDLE_WORD, "attentive");
  assert.equal(SEEDED_WORD, "deaf");
});

test("HOLD is attentive/remounted; ALARM is deaf family", () => {
  assert.ok(HOLD.has("attentive"));
  assert.ok(HOLD.has("remounted"));
  assert.equal(ALARM.has("attentive"), false);
  assert.equal(ALARM.has("remounted"), false);
  for (const chip of [
    "deaf",
    "blur-deaf",
    "ancestor-live",
    "single-deadend",
    "remount-recovers",
    "isDisabled-signature",
    "focus-lost",
    "cousins",
    "has-clear-repro"
  ]) {
    assert.ok(ALARM.has(chip), chip);
  }
  assert.deepEqual(CHIPS, VERDICTS);
  assert.deepEqual(VERDICTS, [
    "attentive",
    "deaf",
    "remounted",
    "blur-deaf",
    "ancestor-live",
    "single-deadend",
    "remount-recovers",
    "isDisabled-signature",
    "focus-lost",
    "has-clear-repro",
    "cousins"
  ]);
});

test("cousins table cites AskUserQuestion neighbourhood", () => {
  assert.deepEqual(
    COUSINS.map((c) => c.issue),
    [84489, 86918]
  );
});

test("fixtures encode issue facts and score their seeds", () => {
  const files = [
    "attentive.json",
    "deaf.json",
    "remounted.json",
    "92694.json",
    "blur-deaf.json",
    "ancestor-live.json",
    "single-deadend.json",
    "remount-recovers.json",
    "isDisabled-signature.json",
    "focus-lost.json",
    "cousins.json",
    "fixtures.json",
    "has-clear-repro.json"
  ];
  for (const name of files) {
    const raw = readFileSync(join(root, "data", name), "utf8");
    assert.match(raw, /92694|espagnolette|attentive|deaf|remounted/i);
    if (name !== "fixtures.json") {
      const fixture = JSON.parse(raw);
      const out = decide(fixture);
      assert.ok(VERDICTS.includes(out.verdict), `${name} → ${out.verdict}`);
    }
  }
  const index = JSON.parse(readFileSync(join(root, "data", "fixtures.json"), "utf8"));
  assert.equal(index.narrativeNotFixture.idle, "attentive");
  assert.equal(index.narrativeNotFixture.seeded, "deaf");
  assert.equal(index.narrativeNotFixture.noLiveSessions, true);
  assert.equal(index.narrativeNotFixture.noPayloads, true);
  assert.equal(index.narrativeNotFixture.noSecrets, true);
  assert.ok(index.narrativeNotFixture.labels.includes("has repro"));
  assert.ok(index.narrativeNotFixture.labels.includes("area:tui"));
  assert.ok(index.narrativeNotFixture.labels.includes("platform:macos"));
  const listed = readdirSync(join(root, "data"));
  assert.ok(listed.includes("README.md"));
});

test("living page is a locksmith casement bench, not a clone", () => {
  assert.match(page, /Instrument Serif/);
  assert.match(page, /Figtree/);
  assert.match(page, /JetBrains Mono/);
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
  assert.doesNotMatch(page, /Petrona/);
  assert.doesNotMatch(page, /Lexend/);
  assert.doesNotMatch(page, /Azeret Mono/);
  assert.doesNotMatch(page, /Fraunces/);
  assert.doesNotMatch(page, /Cinzel/);
  assert.doesNotMatch(page, /Public Sans/);
  assert.doesNotMatch(page, /Cormorant/);
  assert.doesNotMatch(page, /Work Sans/);
  assert.doesNotMatch(page, /IBM Plex/);
  assert.match(page, /deaf/);
  assert.match(page, /remounted/);
  assert.match(page, /\battentive\b/);
  assert.match(page, /#92694/);
  assert.match(page, /Espagnolette/);
  assert.match(page, /embed/);
  assert.match(page, /\?embed=1/);
  assert.match(page, /09:50 \/ hermes catalog #215 \/ #92694/);
  assert.match(page, /Score deaf/);
  assert.match(page, /Admit remounted/);
  assert.match(page, /Pin idle attentive/);
  assert.match(page, /Reset to attentive/);
  assert.match(page, /AskUserQuestion/);
  assert.match(page, /casement/);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /84489/);
  assert.match(page, /86918/);
});

test("page stays off neighboring UIs and prior idle words", () => {
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
});

test("README anti-clone encodes the espagnolette thesis", () => {
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /AskUserQuestion/);
  assert.match(readme, /selection keys/);
  assert.match(readme, /#84489/);
  assert.match(readme, /#86918/);
  assert.match(readme, /How to score/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/espagnolette\//);
  assert.match(readme, /Score deaf or admit remounted/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /NOT #84489/);
  assert.match(readme, /NOT #86918/);
  assert.match(readme, /NOT Imprimatur/);
  assert.match(readme, /NOT Byname/);
  assert.match(hookReadme, /attentive/);
  assert.match(hookReadme, /deaf/);
  assert.match(hookReadme, /remounted/);
  assert.match(dataReadme, /attentive/);
  assert.match(dataReadme, /deaf/);
  assert.match(dataReadme, /remounted/);
});
