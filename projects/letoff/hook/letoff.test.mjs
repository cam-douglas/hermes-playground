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
  seedChorded,
  seedFlattened,
  seedMeshed,
  fingerprint,
  signals,
  chordedSignal,
  flattenedSignal,
  meshedSignal,
  runtimeSplitSignal,
  consoleIntactSignal,
  libuvCollisionSignal,
  kittyAllowlistSignal,
  kittyParsedUnusedSignal,
  ctrlEnterWorkaroundSignal,
  controlMatrixSignal,
  railMeshed,
  shiftWasFlattened,
  consoleStillIntact,
  HOLD,
  ALARM,
  MEASURED,
  CHIPS,
  VERDICTS,
  COUSINS,
  ACTION_RAIL,
  CONTROL_MATRIX,
  IDLE_WORD,
  SEEDED_WORD,
  ADMIT_WORD
} from "./letoff.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const page = readFileSync(join(root, "index.html"), "utf8");
const readme = readFileSync(join(root, "README.md"), "utf8");
const hookReadme = readFileSync(join(root, "hook", "README.md"), "utf8");
const dataReadme = readFileSync(join(root, "data", "README.md"), "utf8");

test("primary 92771 fixture scores flattened", () => {
  const primary = JSON.parse(readFileSync(join(root, "data", "92771.json"), "utf8"));
  const out = decide(primary);
  assert.equal(out.verdict, "flattened");
  assert.equal(out.flattened, true);
  assert.ok(out.chips.includes("flattened"));
  assert.ok(ALARM.has(out.verdict));
});

test("empty / idle probe is chorded", () => {
  const out = decide({});
  assert.equal(out.verdict, "chorded");
  assert.equal(out.chorded, true);
  assert.equal(out.flattened, false);
  assert.ok(HOLD.has("chorded"));
  assert.equal(IDLE_WORD, "chorded");
});

test("chorded fixture is hold", () => {
  const idle = JSON.parse(readFileSync(join(root, "data", "chorded.json"), "utf8"));
  const out = decide(idle);
  assert.equal(out.verdict, "chorded");
  assert.equal(out.chorded, true);
  assert.ok(HOLD.has(out.verdict));
});

test("seeded flattened scores flattened", () => {
  const out = decide(seedFlattened());
  assert.equal(out.verdict, "flattened");
  assert.equal(out.flattened, true);
  assert.ok(out.chips.includes("flattened"));
  assert.ok(out.chips.includes("libuv-collision"));
  assert.ok(out.chips.includes("runtime-split"));
  assert.ok(ALARM.has(out.verdict));
});

test("meshed seed is a hold", () => {
  const out = decide(seedMeshed());
  assert.equal(out.verdict, "meshed");
  assert.equal(out.meshed, true);
  assert.equal(out.flattened, false);
  assert.ok(HOLD.has(out.verdict));
  assert.equal(SEEDED_WORD, "flattened");
  assert.equal(ADMIT_WORD, "meshed");
});

test("chorded seed is idle hold", () => {
  const out = decide(seedChorded());
  assert.equal(out.verdict, "chorded");
  assert.equal(out.chorded, true);
  assert.ok(HOLD.has("chorded"));
});

test("runtime-split chip", () => {
  const out = decide({ seed: "runtime-split", runtimeSplit: true });
  assert.equal(out.verdict, "runtime-split");
  assert.equal(out.flattened, true);
  assert.match(out.reasons.join(" "), /Codex/);
  assert.match(out.reasons.join(" "), /Antigravity/);
  assert.match(out.reasons.join(" "), /runtime/);
});

test("console-intact chip", () => {
  const out = decide({ seed: "console-intact", consoleIntact: true });
  assert.equal(out.verdict, "console-intact");
  assert.match(out.reasons.join(" "), /ReadKey/);
  assert.match(out.reasons.join(" "), /INPUT_RECORD/);
});

test("libuv-collision vs console-intact contrast", () => {
  const libuv = decide({ seed: "libuv-collision", libuvCollision: true });
  const console = decide({ seed: "console-intact", consoleIntact: true });
  assert.equal(libuv.verdict, "libuv-collision");
  assert.equal(console.verdict, "console-intact");
  assert.equal(ACTION_RAIL.find((c) => c.id === "console").tally, "mods=Shift · char=13");
  assert.equal(ACTION_RAIL.find((c) => c.id === "libuv").tally, "Shift+Enter → 0d (collision)");
});

test("libuv-collision chip", () => {
  const out = decide({ seed: "libuv-collision", libuvCollision: true });
  assert.equal(out.verdict, "libuv-collision");
  assert.match(out.reasons.join(" "), /0d/);
  assert.match(out.reasons.join(" "), /collision/);
});

test("kitty-allowlist chip", () => {
  const out = decide({ seed: "kitty-allowlist", kittyAllowlist: true });
  assert.equal(out.verdict, "kitty-allowlist");
  assert.match(out.reasons.join(" "), /xterm-256color/);
  assert.match(out.reasons.join(" "), /KITTY_WINDOW_ID/);
});

test("kitty-parsed-unused chip", () => {
  const out = decide({ seed: "kitty-parsed-unused", kittyParsedUnused: true });
  assert.equal(out.verdict, "kitty-parsed-unused");
  assert.match(out.reasons.join(" "), /kittyKeyboard/);
  assert.match(out.reasons.join(" "), /never consumed/);
});

test("ctrl-enter-workaround chip", () => {
  const out = decide({ seed: "ctrl-enter-workaround", ctrlEnterWorkaround: true });
  assert.equal(out.verdict, "ctrl-enter-workaround");
  assert.match(out.reasons.join(" "), /Ctrl\+Enter/);
  assert.match(out.reasons.join(" "), /0a/);
});

test("control-matrix chip", () => {
  const out = decide({ seed: "control-matrix", controlMatrix: true });
  assert.equal(out.verdict, "control-matrix");
  assert.match(out.reasons.join(" "), /console keeps modifiers/);
  assert.match(out.reasons.join(" "), /Rust/);
});

test("cousins cite-only Windows Terminal / WezTerm kitty / libuv generic", () => {
  const out = decide({
    seed: "cousins",
    cousinsCiteOnly: COUSINS
  });
  assert.equal(out.verdict, "cousins");
  assert.match(out.reasons.join(" "), /87888/);
  assert.match(out.reasons.join(" "), /92021/);
  assert.match(out.reasons.join(" "), /92771/);
  assert.equal(COUSINS.length, 3);
  assert.equal(COUSINS[0].state, "open");
  assert.equal(COUSINS[1].state, "open");
  assert.equal(COUSINS[2].state, "generic");
});

test("has-clear-repro chip from labels", () => {
  const out = decide({ seed: "has-clear-repro", hasClearRepro: true });
  assert.equal(out.verdict, "has-clear-repro");
  assert.match(out.reasons.join(" "), /has-clear-repro/);
  assert.match(out.reasons.join(" "), /has repro/);
});

test("analyze / score / handle / seeds / scoreFields", () => {
  const idle = analyze({});
  assert.equal(idle.verdict, "chorded");
  assert.equal(score(seedMeshed()).verdict, "meshed");
  assert.equal(handle('{"seed":"flattened","flattened":true}').verdict, "flattened");
  assert.equal(handle({ seed: "meshed", meshed: true }).verdict, "meshed");
  const bag = seeds();
  assert.equal(decide(bag.chorded).verdict, "chorded");
  assert.equal(decide(bag.flattened).verdict, "flattened");
  assert.equal(decide(bag.meshed).verdict, "meshed");
  assert.equal(scoreFields(seedFlattened()).flattened, true);
});

test("fingerprint and signals detect letoff facts", () => {
  assert.equal(
    chordedSignal("idle rail is chorded; pin idle chorded; Shift retained; chat:newline would fire"),
    true
  );
  assert.equal(
    flattenedSignal("Shift flattened; flattened to bare Enter; 0d (collision); dwControlKeyState"),
    true
  );
  assert.equal(meshedSignal("already meshed; modifier path retained; ReadConsoleInput handled"), true);
  assert.equal(runtimeSplitSignal("runtime-split Codex Antigravity split follows the runtime"), true);
  assert.equal(consoleIntactSignal("console-intact .NET ReadKey mods=Shift INPUT_RECORD"), true);
  assert.equal(libuvCollisionSignal("libuv-collision process.stdin raw Shift+Enter → 0d uv_tty"), true);
  assert.equal(kittyAllowlistSignal("kitty-allowlist hardcoded allowlist xterm-256color never enables KITTY_WINDOW_ID"), true);
  assert.equal(kittyParsedUnusedSignal("kitty-parsed-unused kittyKeyboard never consumed ESC[?0u"), true);
  assert.equal(ctrlEnterWorkaroundSignal("ctrl-enter-workaround Ctrl+Enter emits 0a works on Windows today"), true);
  assert.equal(controlMatrixSignal("control-matrix console keeps modifiers Rust CLIs in the same session"), true);
  const hits = signals(seedFlattened());
  assert.equal(hits.flattened || hits.libuvCollision || hits.runtimeSplit, true);
  const print = fingerprint(seedFlattened());
  assert.equal(print.flattenedHit, true);
  assert.equal(print.shiftFlattened, true);
});

test("fingerprint scores meshed rail path", () => {
  const print = fingerprint(seedMeshed());
  assert.equal(print.meshedClean, true);
  assert.equal(print.flattenedHit, false);
  const out = decide({ ...seedMeshed(), seed: "meshed" });
  assert.equal(out.meshed, true);
  assert.equal(out.verdict, "meshed");
  assert.equal(railMeshed(seedMeshed()), true);
  assert.equal(railMeshed(seedFlattened()), false);
});

test("classify idle vs hold flags", () => {
  const alarm = classify(seedFlattened());
  assert.equal(alarm.flattened, true);
  const hold = classify(seedMeshed());
  assert.equal(hold.meshed, true);
  const idle = classify(seedChorded());
  assert.equal(idle.chorded, true);
});

test("helpers encode shift flattened + console intact", () => {
  assert.equal(shiftWasFlattened(seedFlattened()), true);
  assert.equal(consoleStillIntact(seedFlattened()), true);
  assert.equal(shiftWasFlattened(seedChorded()), false);
  assert.equal(shiftWasFlattened({ flattened: true }), true);
  assert.equal(consoleStillIntact({ consoleIntact: true }), true);
});

test("action rail encodes the issue split", () => {
  assert.ok(ACTION_RAIL.some((row) => row.id === "console" && /INPUT_RECORD/i.test(row.role)));
  assert.ok(ACTION_RAIL.some((row) => row.id === "libuv" && /collision/i.test(row.tally)));
  assert.ok(ACTION_RAIL.some((row) => row.id === "meshed" && /modifier path/i.test(row.tally)));
  assert.ok(ACTION_RAIL.length === 3);
  assert.equal(CONTROL_MATRIX.length, 4);
  assert.equal(CONTROL_MATRIX.filter((row) => row.distinguishable === false).length, 2);
  assert.equal(CONTROL_MATRIX.filter((row) => row.distinguishable === true).length, 2);
});

test("measured facts from #92771", () => {
  assert.equal(MEASURED.issue, 92771);
  assert.equal(MEASURED.state, "open");
  assert.deepEqual(MEASURED.labels, ["bug", "has repro", "platform:windows", "area:tui", "keybindings"]);
  assert.equal(MEASURED.filed, "2026-09-08T03:49:28Z");
  assert.match(MEASURED.claude, /2\.1\.263/);
  assert.match(MEASURED.claude, /Bun v1\.4\.1/);
  assert.match(MEASURED.os, /Windows 11 Pro/);
  assert.match(MEASURED.os, /10\.0\.26200/);
  assert.match(MEASURED.terminal, /Netcatty/);
  assert.equal(MEASURED.term, "xterm-256color");
  assert.equal(MEASURED.shell, "PowerShell");
  assert.equal(MEASURED.libuvRaw.enter, "0d");
  assert.equal(MEASURED.libuvRaw.shiftEnter, "0d");
  assert.equal(MEASURED.libuvRaw.ctrlEnter, "0a");
  assert.equal(MEASURED.consoleReadKey.shiftEnter.mods, "Shift");
  assert.equal(MEASURED.kittyQuery, "ESC[?0u");
  assert.equal(MEASURED.kittyWindowIdStillFails, true);
  assert.equal(MEASURED.kittyParsedUnused, true);
  assert.ok(MEASURED.kittyAllowlist.includes("kitty"));
  assert.equal(IDLE_WORD, "chorded");
  assert.equal(SEEDED_WORD, "flattened");
  assert.equal(ADMIT_WORD, "meshed");
});

test("HOLD is chorded/meshed; ALARM is flattened family", () => {
  assert.ok(HOLD.has("chorded"));
  assert.ok(HOLD.has("meshed"));
  assert.equal(ALARM.has("chorded"), false);
  assert.equal(ALARM.has("meshed"), false);
  for (const chip of [
    "flattened",
    "runtime-split",
    "console-intact",
    "libuv-collision",
    "kitty-allowlist",
    "kitty-parsed-unused",
    "ctrl-enter-workaround",
    "control-matrix",
    "cousins",
    "has-clear-repro"
  ]) {
    assert.ok(ALARM.has(chip), chip);
  }
  assert.deepEqual(CHIPS, VERDICTS);
  assert.deepEqual(VERDICTS, [
    "chorded",
    "flattened",
    "meshed",
    "runtime-split",
    "console-intact",
    "libuv-collision",
    "kitty-allowlist",
    "kitty-parsed-unused",
    "ctrl-enter-workaround",
    "control-matrix",
    "has-clear-repro",
    "cousins"
  ]);
});

test("cousins table cites Windows Terminal, WezTerm kitty, libuv generic", () => {
  assert.equal(COUSINS.length, 3);
  assert.ok(COUSINS.some((c) => c.id === 87888 && c.state === "open"));
  assert.ok(COUSINS.some((c) => c.id === 92021 && c.state === "open"));
  assert.ok(COUSINS.some((c) => c.id === "node-libuv-tty" && c.state === "generic"));
});

test("fixtures encode issue facts and score their seeds", () => {
  const files = [
    "chorded.json",
    "flattened.json",
    "meshed.json",
    "92771.json",
    "runtime-split.json",
    "console-intact.json",
    "libuv-collision.json",
    "kitty-allowlist.json",
    "kitty-parsed-unused.json",
    "ctrl-enter-workaround.json",
    "control-matrix.json",
    "cousins.json",
    "fixtures.json",
    "has-clear-repro.json"
  ];
  for (const name of files) {
    const raw = readFileSync(join(root, "data", name), "utf8");
    assert.match(raw, /92771|letoff|chorded|flattened|meshed/i);
    if (name !== "fixtures.json") {
      const fixture = JSON.parse(raw);
      const out = decide(fixture);
      assert.ok(VERDICTS.includes(out.verdict), `${name} → ${out.verdict}`);
    }
  }
  const index = JSON.parse(readFileSync(join(root, "data", "fixtures.json"), "utf8"));
  assert.equal(index.narrativeNotFixture.idle, "chorded");
  assert.equal(index.narrativeNotFixture.seeded, "flattened");
  assert.equal(index.narrativeNotFixture.noLiveSessions, true);
  assert.equal(index.narrativeNotFixture.noPayloads, true);
  assert.equal(index.narrativeNotFixture.noSecrets, true);
  assert.ok(index.narrativeNotFixture.labels.includes("has repro"));
  assert.ok(index.narrativeNotFixture.labels.includes("area:tui"));
  assert.ok(index.narrativeNotFixture.labels.includes("platform:windows"));
  assert.ok(index.narrativeNotFixture.labels.includes("keybindings"));
  const listed = readdirSync(join(root, "data"));
  assert.ok(listed.includes("README.md"));
});

test("living page is a piano let-off gauge, not a clone", () => {
  assert.match(page, /Lora/);
  assert.match(page, /Plus Jakarta Sans/);
  assert.match(page, /Cousine/);
  assert.doesNotMatch(page, /Newsreader/);
  assert.doesNotMatch(page, /Karla/);
  assert.doesNotMatch(page, /IBM Plex Mono/);
  assert.doesNotMatch(page, /Literata/);
  assert.doesNotMatch(page, /Red Hat Text/);
  assert.doesNotMatch(page, /Fira Code/);
  assert.doesNotMatch(page, /Bitter/);
  assert.doesNotMatch(page, /Fragment Mono/);
  assert.doesNotMatch(page, /Manrope/);
  assert.doesNotMatch(page, /DM Serif Display/);
  assert.doesNotMatch(page, /Commissioner/);
  assert.doesNotMatch(page, /Azeret Mono/);
  assert.doesNotMatch(page, /Instrument Serif/);
  assert.doesNotMatch(page, /Figtree/);
  assert.doesNotMatch(page, /JetBrains Mono/);
  assert.doesNotMatch(page, /Playfair Display/);
  assert.doesNotMatch(page, /DM Sans/);
  assert.doesNotMatch(page, /Sora/);
  assert.doesNotMatch(page, /Ibarra Real Nova/);
  assert.doesNotMatch(page, /Geist Mono/);
  assert.doesNotMatch(page, /Cardo/);
  assert.doesNotMatch(page, /Public Sans/);
  assert.doesNotMatch(page, /Young Serif/);
  assert.doesNotMatch(page, /Bodoni Moda/);
  assert.doesNotMatch(page, /Nunito Sans/);
  assert.match(page, /flattened/);
  assert.match(page, /meshed/);
  assert.match(page, /\bchorded\b/);
  assert.match(page, /#92771/);
  assert.match(page, /Letoff/);
  assert.match(page, /embed/);
  assert.match(page, /\?embed=1/);
  assert.match(page, /13:50 \/ hermes catalog #219 \/ #92771/);
  assert.match(page, /Score flattened/);
  assert.match(page, /Admit meshed/);
  assert.match(page, /Pin idle chorded/);
  assert.match(page, /Reset to chorded/);
  assert.match(page, /Shift\+Enter/);
  assert.match(page, /libuv/);
  assert.match(page, /chat:newline/);
  assert.match(page, /LET-OFF/);
  assert.match(page, /ivory/);
  assert.match(page, /ebony/);
  assert.match(page, /cousin-not-primary/);
});

test("page stays off neighboring UIs and prior idle words", () => {
  assert.doesNotMatch(page, /PTY BIND/);
  assert.doesNotMatch(page, /stevedore's dunnage/i);
  assert.doesNotMatch(page, /dark hold timber/i);
  assert.doesNotMatch(page, /letterpress set-off/i);
  assert.doesNotMatch(page, /dampened tympan/i);
  assert.doesNotMatch(page, /locksmith's espagnolette/i);
  assert.doesNotMatch(page, /casement-fastener/i);
  assert.doesNotMatch(page, /censor's imprimatur/i);
  assert.doesNotMatch(page, /nihil-obstat/i);
  assert.doesNotMatch(page, /herald's byname/i);
  assert.doesNotMatch(page, /mason's battlement/i);
  assert.doesNotMatch(page, /(?<!has-)\bclear\b/);
  assert.doesNotMatch(page, /\bpiped\b/);
  assert.doesNotMatch(page, /\blean\b/);
  assert.doesNotMatch(page, /\bladen\b/);
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
  assert.doesNotMatch(page, /\battentive\b/);
  assert.doesNotMatch(page, /\bdeaf\b/);
  assert.doesNotMatch(page, /\bremounted\b/);
  assert.doesNotMatch(page, /\bshed\b/);
  assert.doesNotMatch(page, /\bberthed\b/);
  assert.doesNotMatch(page, /\bechoed\b/);
  assert.doesNotMatch(page, /\badvanced\b/);
  assert.doesNotMatch(page, /\bswallowed\b/);
  assert.doesNotMatch(page, /\bunbound\b/);
});

test("README anti-clone encodes the letoff thesis", () => {
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /Shift\+Enter/);
  assert.match(readme, /libuv/);
  assert.match(readme, /How to score/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/letoff\//);
  assert.match(readme, /Score flattened or admit meshed/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /NOT Ptybind/);
  assert.match(readme, /NOT Dunnage/);
  assert.match(readme, /NOT Setoff/);
  assert.match(readme, /NOT Espagnolette/);
  assert.match(hookReadme, /chorded/);
  assert.match(hookReadme, /flattened/);
  assert.match(hookReadme, /meshed/);
  assert.match(dataReadme, /chorded/);
  assert.match(dataReadme, /flattened/);
  assert.match(dataReadme, /meshed/);
});
