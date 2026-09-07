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
  seedRazed,
  seedBelayed,
  fingerprint,
  isolationWorktree,
  poolSlotPath,
  massDeletionSignal,
  keepActiveSignal,
  reflogChurnSignal,
  HOLD,
  ALARM,
  MEASURED,
  CHIPS,
  VERDICTS,
  COUSINS,
  IDLE_WORD,
  SEEDED_WORD
} from "./bitts.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const page = readFileSync(join(root, "index.html"), "utf8");
const readme = readFileSync(join(root, "README.md"), "utf8");
const hookReadme = readFileSync(join(root, "hook", "README.md"), "utf8");
const dataReadme = readFileSync(join(root, "data", "README.md"), "utf8");

test("primary 92573 fixture scores razed", () => {
  const primary = JSON.parse(readFileSync(join(root, "data", "92573.json"), "utf8"));
  const out = decide(primary);
  assert.equal(out.verdict, "razed");
  assert.equal(out.razed, true);
  assert.ok(out.chips.includes("razed"));
});

test("empty / idle probe is razed", () => {
  const out = decide({});
  assert.equal(out.verdict, "razed");
  assert.equal(out.razed, true);
  assert.equal(out.belayed, false);
  assert.ok(ALARM.has("razed"));
  assert.equal(IDLE_WORD, "razed");
});

test("seeded razed scores razed", () => {
  const out = decide(seedRazed());
  assert.equal(out.verdict, "razed");
  assert.equal(out.razed, true);
  assert.ok(out.chips.includes("razed"));
  assert.ok(out.chips.includes("slot-recycle"));
  assert.ok(out.chips.includes("mass-deletions"));
});

test("belayed seed is a hold", () => {
  const out = decide(seedBelayed());
  assert.equal(out.verdict, "belayed");
  assert.equal(out.belayed, true);
  assert.equal(out.razed, false);
  assert.ok(HOLD.has(out.verdict));
  assert.equal(SEEDED_WORD, "belayed");
});

test("slot-recycle chip", () => {
  const out = decide({ seed: "slot-recycle", slotRecycle: true });
  assert.equal(out.verdict, "slot-recycle");
  assert.equal(out.razed, true);
  assert.match(out.reasons.join(" "), /Agent\(isolation: "worktree"\)/);
  assert.match(out.reasons.join(" "), /\.claude\/worktrees/);
});

test("reflog-churn chip", () => {
  const out = decide({ seed: "reflog-churn", reflogChurn: true });
  assert.equal(out.verdict, "reflog-churn");
  assert.ok(out.chips.includes("reflog-churn"));
  assert.match(out.reasons.join(" "), /reset: moving to origin\/main/);
  assert.match(out.reasons.join(" "), /detached HEAD/);
  assert.match(out.reasons.join(" "), /at least three unrelated branches/i);
});

test("keep-active chip", () => {
  const out = decide({ seed: "keep-active", keepActive: true });
  assert.equal(out.verdict, "keep-active");
  assert.match(out.reasons.join(" "), /keep:active/);
  assert.match(out.reasons.join(" "), /never touched/);
});

test("mass-deletions chip", () => {
  const out = decide({ seed: "mass-deletions", massDeletions: true });
  assert.equal(out.verdict, "mass-deletions");
  assert.match(out.reasons.join(" "), /5,900|5900/);
  assert.match(out.reasons.join(" "), /unstaged deletions/);
  assert.match(out.reasons.join(" "), /\.githooks\/\*/);
});

test("cousins cite-only", () => {
  const out = decide({ seed: "cousins", cousinsCiteOnly: [87349, 73900, 92019] });
  assert.equal(out.verdict, "cousins");
  assert.match(out.reasons.join(" "), /#87349/);
  assert.match(out.reasons.join(" "), /#73900/);
  assert.match(out.reasons.join(" "), /#92019/);
  assert.match(out.reasons.join(" "), /Gland/);
  assert.match(out.reasons.join(" "), /Seizing/);
});

test("hold chip admits belayed path", () => {
  const out = decide({ seed: "hold", belayed: true, intact: true });
  assert.equal(out.verdict, "hold");
  assert.equal(out.belayed, true);
  assert.ok(HOLD.has("hold"));
});

test("has-clear-repro chip", () => {
  const out = decide({ seed: "has-clear-repro", hasClearRepro: true });
  assert.equal(out.verdict, "has-clear-repro");
  assert.match(out.reasons.join(" "), /has repro/);
  assert.match(out.reasons.join(" "), /amazing-colden-f035e5/);
  assert.match(out.reasons.join(" "), /2026-08-14/);
});

test("analyze / score / handle / seeds / scoreFields", () => {
  const idle = analyze({});
  assert.equal(idle.verdict, "razed");
  assert.equal(score(seedBelayed()).verdict, "belayed");
  assert.equal(handle('{"seed":"razed","razed":true}').verdict, "razed");
  assert.equal(handle({ seed: "belayed", belayed: true }).verdict, "belayed");
  const bag = seeds();
  assert.equal(decide(bag.razed).verdict, "razed");
  assert.equal(decide(bag.belayed).verdict, "belayed");
  assert.equal(scoreFields(seedRazed()).razed, true);
});

test("fingerprint detects pool recycle and mass deletions", () => {
  assert.equal(isolationWorktree('Agent(isolation: "worktree")'), true);
  assert.equal(poolSlotPath(".claude/worktrees/amazing-colden-f035e5"), true);
  assert.equal(massDeletionSignal("~5,900 tracked files vanish as unstaged deletions .githooks/*"), true);
  assert.equal(keepActiveSignal("keep:active never touched"), true);
  assert.equal(reflogChurnSignal("reset: moving to origin/main detached HEAD"), true);
  const print = fingerprint(seedRazed());
  assert.equal(print.isolation, true);
  assert.equal(print.pool, true);
  assert.equal(print.vanished, true);
});

test("fingerprint scores belayed intact timeline", () => {
  const print = fingerprint(seedBelayed());
  assert.equal(print.intact, true);
  assert.equal(print.vanished, false);
  const out = decide({ ...seedBelayed(), seed: "belayed" });
  assert.equal(out.belayed, true);
  assert.equal(out.verdict, "belayed");
});

test("classify idle vs hold flags", () => {
  const idle = classify(seedRazed());
  assert.equal(idle.razed, true);
  const hold = classify(seedBelayed());
  assert.equal(hold.belayed, true);
});

test("measured facts from #92573", () => {
  assert.equal(MEASURED.issue, 92573);
  assert.equal(MEASURED.state, "open");
  assert.deepEqual(MEASURED.labels, ["bug", "has repro", "area:agents", "data-loss"]);
  assert.equal(MEASURED.filed, "2026-09-07T00:57:35Z");
  assert.equal(MEASURED.updated, "2026-09-07T00:58:45Z");
  assert.equal(MEASURED.reporter, "capfininv");
  assert.equal(MEASURED.comments, 0);
  assert.equal(MEASURED.isolation, "worktree");
  assert.equal(MEASURED.isolationCall, 'Agent(isolation: "worktree")');
  assert.equal(MEASURED.poolPath, ".claude/worktrees/<name>");
  assert.equal(MEASURED.trackedFilesVanished, 5900);
  assert.equal(MEASURED.reaperVerdict, "keep:active");
  assert.equal(MEASURED.reaperTouched, false);
  assert.equal(MEASURED.reflogUnrelatedBranchesMin, 3);
  assert.equal(MEASURED.reflogReset, "reset: moving to origin/main");
  assert.equal(MEASURED.detachedHead, true);
  assert.equal(MEASURED.priorIncident, "2026-08-14");
  assert.equal(MEASURED.priorWorktree, "amazing-colden-f035e5");
  assert.ok(MEASURED.unstagedDeletions.includes(".githooks/*"));
  assert.ok(MEASURED.noDestructiveCommand.includes("rm"));
  assert.equal(IDLE_WORD, "razed");
  assert.equal(SEEDED_WORD, "belayed");
});

test("HOLD is belayed / hold; ALARM is razed family", () => {
  assert.ok(HOLD.has("belayed"));
  assert.ok(HOLD.has("hold"));
  assert.equal(ALARM.has("belayed"), false);
  for (const chip of [
    "razed",
    "slot-recycle",
    "reflog-churn",
    "keep-active",
    "mass-deletions",
    "cousins",
    "has-clear-repro"
  ]) {
    assert.ok(ALARM.has(chip), chip);
  }
  assert.deepEqual(CHIPS, VERDICTS);
  assert.deepEqual(VERDICTS, [
    "razed",
    "belayed",
    "slot-recycle",
    "reflog-churn",
    "keep-active",
    "mass-deletions",
    "cousins",
    "hold",
    "has-clear-repro"
  ]);
});

test("cousins table is cite-only pin-race / archive / windows checkout", () => {
  assert.deepEqual(
    COUSINS.map((c) => c.id),
    [87349, 73900, 92019]
  );
});

test("fixtures encode issue facts and score their seeds", () => {
  const files = [
    "razed.json",
    "belayed.json",
    "92573.json",
    "keep-active.json",
    "slot-recycle.json",
    "reflog-churn.json",
    "mass-deletions.json",
    "cousins.json",
    "fixtures.json",
    "hold.json",
    "has-clear-repro.json"
  ];
  for (const name of files) {
    const raw = readFileSync(join(root, "data", name), "utf8");
    assert.match(raw, /92573|bitts|razed|belayed/i);
    if (name !== "fixtures.json") {
      const fixture = JSON.parse(raw);
      const out = decide(fixture);
      assert.ok(VERDICTS.includes(out.verdict), `${name} → ${out.verdict}`);
    }
  }
  const index = JSON.parse(readFileSync(join(root, "data", "fixtures.json"), "utf8"));
  assert.equal(index.narrativeNotFixture.idle, "razed");
  assert.equal(index.narrativeNotFixture.seeded, "belayed");
  assert.ok(index.narrativeNotFixture.labels.includes("data-loss"));
  assert.ok(index.narrativeNotFixture.labels.includes("has repro"));
  const listed = readdirSync(join(root, "data"));
  assert.ok(listed.includes("README.md"));
});

test("living page is a dockside mooring bitts atelier, not a clone", () => {
  assert.match(page, /Libre Bodoni/);
  assert.match(page, /Nunito/);
  assert.match(page, /Source Code Pro/);
  assert.doesNotMatch(page, /Libre Caslon/);
  assert.doesNotMatch(page, /Sora/);
  assert.doesNotMatch(page, /Inconsolata/);
  assert.doesNotMatch(page, /Lora/);
  assert.doesNotMatch(page, /Plus Jakarta/);
  assert.doesNotMatch(page, /Martian Mono/);
  assert.doesNotMatch(page, /Fraunces/);
  assert.doesNotMatch(page, /Manrope/);
  assert.doesNotMatch(page, /Cormorant/);
  assert.doesNotMatch(page, /Outfit/);
  assert.doesNotMatch(page, /Libre Baskerville/);
  assert.doesNotMatch(page, /DM Sans/);
  assert.doesNotMatch(page, /Spectral/);
  assert.doesNotMatch(page, /Karla/);
  assert.match(page, /razed/);
  assert.match(page, /belayed/);
  assert.match(page, /#92573/);
  assert.match(page, /Bitts/);
  assert.match(page, /embed/);
  assert.match(page, /\?embed=1/);
  assert.match(page, /14:50 \/ hermes catalog #198 \/ #92573/);
  assert.match(page, /Score the bitts/);
  assert.match(page, /Pin idle razed/);
  assert.match(page, /Pin seeded belayed/);
  assert.match(page, /Admit belayed/);
  assert.match(page, /Load fixtures/);
  assert.match(page, /Reset to belayed/);
  assert.match(page, /mooring bitts|twin iron|oak wharf|hemp warps|tidal pool-slot/i);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /87349/);
  assert.match(page, /73900/);
  assert.match(page, /92019/);
});

test("page stays off neighboring UIs and prior idle words", () => {
  assert.doesNotMatch(page, /stuffing-box/i);
  assert.doesNotMatch(page, /packing gland/i);
  assert.doesNotMatch(page, /wooden fid/i);
  assert.doesNotMatch(page, /spun yarn/i);
  assert.doesNotMatch(page, /watchtower/i);
  assert.doesNotMatch(page, /larum-bell/i);
  assert.doesNotMatch(page, /\bculled\b/);
  assert.doesNotMatch(page, /\bsole\b/);
  assert.doesNotMatch(page, /\bstripped\b/);
  assert.doesNotMatch(page, /\bpacked\b/);
  assert.doesNotMatch(page, /\bunanswered\b/);
  assert.doesNotMatch(page, /\broused\b/);
  assert.doesNotMatch(page, /\bslipped\b/);
  assert.doesNotMatch(page, /\bsighted\b/);
  assert.doesNotMatch(page, /\briven\b/);
  assert.doesNotMatch(page, /\bargbound\b/);
  assert.doesNotMatch(page, /\baccruing\b/);
  assert.doesNotMatch(page, /\bsheared\b/);
  assert.doesNotMatch(page, /\bfayed\b/);
  assert.doesNotMatch(page, /\boverladen\b/);
  assert.doesNotMatch(page, /\bdefocused\b/);
  assert.doesNotMatch(page, /\bskimmed\b/);
});

test("README anti-clone encodes the pool-slot thesis", () => {
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /WORKTREE POOL PHYSICAL DIRECTORY/i);
  assert.match(readme, /Agent\(isolation: "worktree"\)/);
  assert.match(readme, /\.claude\/worktrees/);
  assert.match(readme, /5,900|5900/);
  assert.match(readme, /keep:active/);
  assert.match(readme, /reset: moving to origin\/main/);
  assert.match(readme, /amazing-colden-f035e5/);
  assert.match(readme, /2026-08-14/);
  assert.match(readme, /capfininv/);
  assert.match(readme, /data-loss/);
  assert.match(readme, /has repro/);
  assert.match(readme, /#92533/);
  assert.match(readme, /#92586/);
  assert.match(readme, /#87349/);
  assert.match(readme, /#73900/);
  assert.match(readme, /#92019/);
  assert.match(readme, /How to score/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/bitts\//);
  assert.match(readme, /Score razed or admit belayed/);
  assert.match(hookReadme, /razed/);
  assert.match(hookReadme, /belayed/);
  assert.match(dataReadme, /razed/);
  assert.match(dataReadme, /belayed/);
});
