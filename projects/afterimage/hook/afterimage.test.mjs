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
  seedLatent,
  seedFlushed,
  fingerprint,
  signals,
  thinkingPaintsSignal,
  textZeroFramesSignal,
  megaFrameStopSignal,
  linuxProgressiveSignal,
  nonstreamingFallbackSignal,
  fineGrainedNoEffectSignal,
  textPaintsLive,
  HOLD,
  ALARM,
  MEASURED,
  CHIPS,
  VERDICTS,
  COUSINS,
  PHOSPHOR_PHASES,
  IDLE_WORD,
  SEEDED_WORD
} from "./afterimage.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const page = readFileSync(join(root, "index.html"), "utf8");
const readme = readFileSync(join(root, "README.md"), "utf8");
const hookReadme = readFileSync(join(root, "hook", "README.md"), "utf8");
const dataReadme = readFileSync(join(root, "data", "README.md"), "utf8");

test("primary 92596 fixture scores latent", () => {
  const primary = JSON.parse(readFileSync(join(root, "data", "92596.json"), "utf8"));
  const out = decide(primary);
  assert.equal(out.verdict, "latent");
  assert.equal(out.latent, true);
  assert.ok(out.chips.includes("latent"));
});

test("empty / idle probe is latent", () => {
  const out = decide({});
  assert.equal(out.verdict, "latent");
  assert.equal(out.latent, true);
  assert.equal(out.flushed, false);
  assert.ok(ALARM.has("latent"));
  assert.equal(IDLE_WORD, "latent");
});

test("seeded latent scores latent", () => {
  const out = decide(seedLatent());
  assert.equal(out.verdict, "latent");
  assert.equal(out.latent, true);
  assert.ok(out.chips.includes("latent"));
  assert.ok(out.chips.includes("thinking-paints"));
  assert.ok(out.chips.includes("text-zero-frames"));
});

test("flushed seed is a hold", () => {
  const out = decide(seedFlushed());
  assert.equal(out.verdict, "flushed");
  assert.equal(out.flushed, true);
  assert.equal(out.latent, false);
  assert.ok(HOLD.has(out.verdict));
  assert.equal(SEEDED_WORD, "flushed");
});

test("thinking-paints chip", () => {
  const out = decide({ seed: "thinking-paints", thinkingPaints: true });
  assert.equal(out.verdict, "thinking-paints");
  assert.equal(out.latent, true);
  assert.match(out.reasons.join(" "), /200 paint frames/);
  assert.match(out.reasons.join(" "), /15 frames/);
});

test("text-zero-frames chip", () => {
  const out = decide({ seed: "text-zero-frames", textZeroFrames: true });
  assert.equal(out.verdict, "text-zero-frames");
  assert.ok(out.chips.includes("text-zero-frames"));
  assert.match(out.reasons.join(" "), /zero paint frames/);
  assert.match(out.reasons.join(" "), /message_stop/);
});

test("mega-frame-stop chip", () => {
  const out = decide({ seed: "mega-frame-stop", megaFrameStop: true });
  assert.equal(out.verdict, "mega-frame-stop");
  assert.match(out.reasons.join(" "), /2,482/);
  assert.match(out.reasons.join(" "), /2,472/);
});

test("linux-progressive chip", () => {
  const out = decide({ seed: "linux-progressive", linuxProgressive: true });
  assert.equal(out.verdict, "linux-progressive");
  assert.match(out.reasons.join(" "), /Linux/);
  assert.match(out.reasons.join(" "), /Windows/);
});

test("nonstreaming-fallback-ruled-out chip", () => {
  const out = decide({
    seed: "nonstreaming-fallback-ruled-out",
    nonstreamingFallbackRuledOut: true
  });
  assert.equal(out.verdict, "nonstreaming-fallback-ruled-out");
  assert.match(out.reasons.join(" "), /DISABLE_NONSTREAMING_FALLBACK/);
  assert.match(out.reasons.join(" "), /token counter/);
});

test("fine-grained-no-effect chip", () => {
  const out = decide({ seed: "fine-grained-no-effect", fineGrainedNoEffect: true });
  assert.equal(out.verdict, "fine-grained-no-effect");
  assert.match(out.reasons.join(" "), /FINE_GRAINED_TOOL_STREAMING/);
  assert.match(out.reasons.join(" "), /no effect on prose/);
});

test("cousins cite-only", () => {
  const out = decide({ seed: "cousins", cousinsCiteOnly: [92616, 92531, 92493] });
  assert.equal(out.verdict, "cousins");
  assert.match(out.reasons.join(" "), /#92616/);
  assert.match(out.reasons.join(" "), /#92531/);
  assert.match(out.reasons.join(" "), /#92493/);
  assert.match(out.reasons.join(" "), /Limber/);
  assert.match(out.reasons.join(" "), /Chock/);
});

test("has-clear-repro chip from labels", () => {
  const out = decide({ seed: "has-clear-repro", hasClearRepro: true });
  assert.equal(out.verdict, "has-clear-repro");
  assert.match(out.reasons.join(" "), /has-clear-repro/);
  assert.match(out.reasons.join(" "), /has repro/);
});

test("analyze / score / handle / seeds / scoreFields", () => {
  const idle = analyze({});
  assert.equal(idle.verdict, "latent");
  assert.equal(score(seedFlushed()).verdict, "flushed");
  assert.equal(handle('{"seed":"latent","latent":true}').verdict, "latent");
  assert.equal(handle({ seed: "flushed", flushed: true }).verdict, "flushed");
  const bag = seeds();
  assert.equal(decide(bag.latent).verdict, "latent");
  assert.equal(decide(bag.flushed).verdict, "flushed");
  assert.equal(scoreFields(seedLatent()).latent, true);
});

test("fingerprint and signals detect frame-timing facts", () => {
  assert.equal(thinkingPaintsSignal("thinking deltas ~200 paint frames at 15 fps"), true);
  assert.equal(textZeroFramesSignal("text phase zero paint frames message area paints nothing"), true);
  assert.equal(megaFrameStopSignal("one mega-frame with 2,482 patches then 2,472-patch repaint"), true);
  assert.equal(linuxProgressiveSignal("streams answer text progressively on Linux"), true);
  assert.equal(
    nonstreamingFallbackSignal("CLAUDE_CODE_DISABLE_NONSTREAMING_FALLBACK non-streaming fallback is ruled out"),
    true
  );
  assert.equal(
    fineGrainedNoEffectSignal("CLAUDE_CODE_ENABLE_FINE_GRAINED_TOOL_STREAMING no effect on prose"),
    true
  );
  const hits = signals(seedLatent());
  assert.equal(hits.thinkingPaints || hits.textZeroFrames || hits.megaFrameStop, true);
  const print = fingerprint(seedLatent());
  assert.equal(print.thinking, true);
  assert.equal(print.textZero, true);
  assert.equal(print.latentHit, true);
});

test("fingerprint scores flushed clean paint path", () => {
  const print = fingerprint(seedFlushed());
  assert.equal(print.flushedClean, true);
  assert.equal(print.latentHit, false);
  const out = decide({ ...seedFlushed(), seed: "flushed" });
  assert.equal(out.flushed, true);
  assert.equal(out.verdict, "flushed");
  assert.equal(textPaintsLive(seedFlushed()), true);
  assert.equal(textPaintsLive(seedLatent()), false);
});

test("classify idle vs hold flags", () => {
  const idle = classify(seedLatent());
  assert.equal(idle.latent, true);
  const hold = classify(seedFlushed());
  assert.equal(hold.flushed, true);
});

test("phosphor phases are thinking / text / stop", () => {
  assert.ok(PHOSPHOR_PHASES.length === 3);
  assert.ok(PHOSPHOR_PHASES.some((row) => row.id === "thinking" && row.paints === true && row.frames === 200));
  assert.ok(PHOSPHOR_PHASES.some((row) => row.id === "text" && row.paints === false && row.frames === 0));
  assert.ok(PHOSPHOR_PHASES.some((row) => row.id === "stop" && row.patches === 2482));
});

test("measured facts from #92596", () => {
  assert.equal(MEASURED.issue, 92596);
  assert.equal(MEASURED.state, "open");
  assert.deepEqual(MEASURED.labels, ["bug", "has repro", "platform:windows", "area:tui"]);
  assert.equal(MEASURED.filed, "2026-09-07T05:29:53Z");
  assert.equal(MEASURED.updated, "2026-09-07T05:30:57Z");
  assert.equal(MEASURED.reporter, "skunpoj");
  assert.equal(MEASURED.comments, 0);
  assert.equal(MEASURED.os, "Windows 11 Enterprise (10.0.22631)");
  assert.equal(MEASURED.cliVersion, "2.1.263");
  assert.equal(MEASURED.terminalIndependent, true);
  assert.equal(MEASURED.pristineClaudeConfigDir, true);
  assert.equal(MEASURED.statusLineLiveTokenCounts, true);
  assert.equal(MEASURED.thinkingPaintFrames, 200);
  assert.equal(MEASURED.thinkingFps, 15);
  assert.equal(MEASURED.textPhasePaintFrames, 0);
  assert.equal(MEASURED.stopFramePatches, 2482);
  assert.equal(MEASURED.stopRepaintPatches, 2472);
  assert.equal(MEASURED.linuxProgressive, true);
  assert.equal(MEASURED.nonstreamingFallbackRuledOut, true);
  assert.equal(MEASURED.fineGrainedNoEffectOnProse, true);
  assert.equal(IDLE_WORD, "latent");
  assert.equal(SEEDED_WORD, "flushed");
});

test("HOLD is flushed; ALARM is latent family", () => {
  assert.ok(HOLD.has("flushed"));
  assert.equal(ALARM.has("flushed"), false);
  for (const chip of [
    "latent",
    "thinking-paints",
    "text-zero-frames",
    "mega-frame-stop",
    "linux-progressive",
    "nonstreaming-fallback-ruled-out",
    "fine-grained-no-effect",
    "cousins",
    "has-clear-repro"
  ]) {
    assert.ok(ALARM.has(chip), chip);
  }
  assert.deepEqual(CHIPS, VERDICTS);
  assert.deepEqual(VERDICTS, [
    "latent",
    "flushed",
    "thinking-paints",
    "text-zero-frames",
    "mega-frame-stop",
    "linux-progressive",
    "nonstreaming-fallback-ruled-out",
    "fine-grained-no-effect",
    "cousins",
    "has-clear-repro"
  ]);
});

test("cousins table is cite-only 92616 / 92531 / 92493", () => {
  assert.deepEqual(
    COUSINS.map((c) => c.id),
    [92616, 92531, 92493]
  );
});

test("fixtures encode issue facts and score their seeds", () => {
  const files = [
    "latent.json",
    "flushed.json",
    "92596.json",
    "thinking-paints.json",
    "text-zero-frames.json",
    "mega-frame-stop.json",
    "linux-progressive.json",
    "nonstreaming-fallback-ruled-out.json",
    "fine-grained-no-effect.json",
    "cousins.json",
    "fixtures.json",
    "has-clear-repro.json"
  ];
  for (const name of files) {
    const raw = readFileSync(join(root, "data", name), "utf8");
    assert.match(raw, /92596|afterimage|latent|flushed/i);
    if (name !== "fixtures.json") {
      const fixture = JSON.parse(raw);
      const out = decide(fixture);
      assert.ok(VERDICTS.includes(out.verdict), `${name} → ${out.verdict}`);
    }
  }
  const index = JSON.parse(readFileSync(join(root, "data", "fixtures.json"), "utf8"));
  assert.equal(index.narrativeNotFixture.idle, "latent");
  assert.equal(index.narrativeNotFixture.seeded, "flushed");
  assert.ok(index.narrativeNotFixture.labels.includes("has repro"));
  assert.ok(index.narrativeNotFixture.labels.includes("area:tui"));
  const listed = readdirSync(join(root, "data"));
  assert.ok(listed.includes("README.md"));
});

test("living page is a CRT afterimage bench, not a clone", () => {
  assert.match(page, /Instrument Serif/);
  assert.match(page, /Plus Jakarta Sans/);
  assert.match(page, /IBM Plex Mono/);
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
  assert.doesNotMatch(page, /Libre Bodoni/);
  assert.doesNotMatch(page, /Nunito/);
  assert.doesNotMatch(page, /Figtree/);
  assert.match(page, /latent/);
  assert.match(page, /flushed/);
  assert.match(page, /#92596/);
  assert.match(page, /Afterimage/);
  assert.match(page, /embed/);
  assert.match(page, /\?embed=1/);
  assert.match(page, /20:50 \/ hermes catalog #204 \/ #92596/);
  assert.match(page, /Score the afterimage/);
  assert.match(page, /Pin idle latent/);
  assert.match(page, /Pin seeded flushed/);
  assert.match(page, /Admit flushed/);
  assert.match(page, /Load fixtures/);
  assert.match(page, /Reset to flushed/);
  assert.match(page, /phosphor|retina|afterimage test card|CRT/i);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /92616/);
  assert.match(page, /92531/);
  assert.match(page, /92493/);
  assert.match(page, /CLAUDE_CODE_FRAME_TIMING_LOG/);
});

test("page stays off neighboring UIs and prior idle words", () => {
  assert.doesNotMatch(page, /limber-hole/i);
  assert.doesNotMatch(page, /bilge well/i);
  assert.doesNotMatch(page, /wheel-chock/i);
  assert.doesNotMatch(page, /oak wedge/i);
  assert.doesNotMatch(page, /chalk fence/i);
  assert.doesNotMatch(page, /deadman's switch/i);
  assert.doesNotMatch(page, /locomotive/i);
  assert.doesNotMatch(page, /glass-plate/i);
  assert.doesNotMatch(page, /wet-plate/i);
  assert.doesNotMatch(page, /trial-lens/i);
  assert.doesNotMatch(page, /stroboscope/i);
  assert.doesNotMatch(page, /scrim loft/i);
  assert.doesNotMatch(page, /\bsilted\b/);
  assert.doesNotMatch(page, /\bdrained\b/);
  assert.doesNotMatch(page, /\bbarred\b/);
  assert.doesNotMatch(page, /\badmitted\b/);
  assert.doesNotMatch(page, /\brunaway\b/);
  assert.doesNotMatch(page, /\bhaunted\b/);
  assert.doesNotMatch(page, /\blatched\b/);
  assert.doesNotMatch(page, /\bstaged\b/);
  assert.doesNotMatch(page, /\bblanked\b/);
});

test("README anti-clone encodes the afterimage thesis", () => {
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /message_stop/);
  assert.match(readme, /2,482/);
  assert.match(readme, /skunpoj/);
  assert.match(readme, /#92616/);
  assert.match(readme, /#92531/);
  assert.match(readme, /#92493/);
  assert.match(readme, /How to score/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/afterimage\//);
  assert.match(readme, /Score latent or admit flushed/);
  assert.match(readme, /NON-BINDING/);
  assert.match(hookReadme, /latent/);
  assert.match(hookReadme, /flushed/);
  assert.match(dataReadme, /latent/);
  assert.match(dataReadme, /flushed/);
});
