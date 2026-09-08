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
  seedPiped,
  seedSwallowed,
  seedUnbound,
  fingerprint,
  signals,
  pipedSignal,
  swallowedSignal,
  unboundSignal,
  editorRendersSignal,
  keysDeadSignal,
  parentConsumingSignal,
  conptyMuxSignal,
  guiWorkaroundSignal,
  nodeReproSignal,
  controlMatrixSignal,
  plateUnbound,
  keysWereDead,
  parentStillConsuming,
  HOLD,
  ALARM,
  MEASURED,
  CHIPS,
  VERDICTS,
  COUSINS,
  BIND_LEDGER,
  CONTROL_MATRIX,
  IDLE_WORD,
  SEEDED_WORD,
  ADMIT_WORD
} from "./ptybind.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const page = readFileSync(join(root, "index.html"), "utf8");
const readme = readFileSync(join(root, "README.md"), "utf8");
const hookReadme = readFileSync(join(root, "hook", "README.md"), "utf8");
const dataReadme = readFileSync(join(root, "data", "README.md"), "utf8");

test("primary 92757 fixture scores swallowed", () => {
  const primary = JSON.parse(readFileSync(join(root, "data", "92757.json"), "utf8"));
  const out = decide(primary);
  assert.equal(out.verdict, "swallowed");
  assert.equal(out.swallowed, true);
  assert.ok(out.chips.includes("swallowed"));
  assert.ok(ALARM.has(out.verdict));
});

test("empty / idle probe is piped", () => {
  const out = decide({});
  assert.equal(out.verdict, "piped");
  assert.equal(out.piped, true);
  assert.equal(out.swallowed, false);
  assert.ok(HOLD.has("piped"));
  assert.equal(IDLE_WORD, "piped");
});

test("piped fixture is hold", () => {
  const idle = JSON.parse(readFileSync(join(root, "data", "piped.json"), "utf8"));
  const out = decide(idle);
  assert.equal(out.verdict, "piped");
  assert.equal(out.piped, true);
  assert.ok(HOLD.has(out.verdict));
});

test("seeded swallowed scores swallowed", () => {
  const out = decide(seedSwallowed());
  assert.equal(out.verdict, "swallowed");
  assert.equal(out.swallowed, true);
  assert.ok(out.chips.includes("swallowed"));
  assert.ok(out.chips.includes("keys-dead"));
  assert.ok(out.chips.includes("parent-consuming"));
  assert.ok(ALARM.has(out.verdict));
});

test("unbound seed is a hold", () => {
  const out = decide(seedUnbound());
  assert.equal(out.verdict, "unbound");
  assert.equal(out.unbound, true);
  assert.equal(out.swallowed, false);
  assert.ok(HOLD.has(out.verdict));
  assert.equal(SEEDED_WORD, "swallowed");
  assert.equal(ADMIT_WORD, "unbound");
});

test("piped seed is idle hold", () => {
  const out = decide(seedPiped());
  assert.equal(out.verdict, "piped");
  assert.equal(out.piped, true);
  assert.ok(HOLD.has("piped"));
});

test("editor-renders chip", () => {
  const out = decide({ seed: "editor-renders", editorRenders: true });
  assert.equal(out.verdict, "editor-renders");
  assert.equal(out.swallowed, true);
  assert.match(out.reasons.join(" "), /draws correctly|renders correctly/);
  assert.match(out.reasons.join(" "), /only input is lost/);
});

test("keys-dead chip", () => {
  const out = decide({ seed: "keys-dead", keysDead: true });
  assert.equal(out.verdict, "keys-dead");
  assert.match(out.reasons.join(" "), /Esc/);
  assert.match(out.reasons.join(" "), /Ctrl\+C/);
});

test("parent-consuming vs conpty-mux contrast", () => {
  const parent = decide({ seed: "parent-consuming", parentConsuming: true });
  const mux = decide({ seed: "conpty-mux", conptyMux: true });
  assert.equal(parent.verdict, "parent-consuming");
  assert.equal(mux.verdict, "conpty-mux");
  assert.equal(BIND_LEDGER.find((c) => c.id === "parent").tally, "setRawMode(true) then pause");
  assert.equal(BIND_LEDGER.find((c) => c.id === "child").tally, "i · Esc · Ctrl+C dead");
});

test("parent-consuming chip", () => {
  const out = decide({ seed: "parent-consuming", parentConsuming: true });
  assert.equal(out.verdict, "parent-consuming");
  assert.match(out.reasons.join(" "), /own prompt/);
  assert.match(out.reasons.join(" "), /still consuming/);
});

test("gui-workaround chip", () => {
  const out = decide({ seed: "gui-workaround", guiWorkaround: true });
  assert.equal(out.verdict, "gui-workaround");
  assert.match(out.reasons.join(" "), /gvim -f/);
});

test("node-repro chip", () => {
  const out = decide({ seed: "node-repro", nodeRepro: true });
  assert.equal(out.verdict, "node-repro");
  assert.match(out.reasons.join(" "), /13-line Node/);
  assert.match(out.reasons.join(" "), /stdio/);
});

test("control-matrix chip", () => {
  const out = decide({ seed: "control-matrix", controlMatrix: true });
  assert.equal(out.verdict, "control-matrix");
  assert.match(out.reasons.join(" "), /real tmux/);
  assert.match(out.reasons.join(" "), /psmux/);
});

test("cousins cite-only WezTerm / window-kill / hang / bg-spare", () => {
  const out = decide({
    seed: "cousins",
    cousinsCiteOnly: COUSINS
  });
  assert.equal(out.verdict, "cousins");
  assert.match(out.reasons.join(" "), /73301/);
  assert.match(out.reasons.join(" "), /84264/);
  assert.match(out.reasons.join(" "), /58664/);
  assert.match(out.reasons.join(" "), /88775/);
  assert.match(out.reasons.join(" "), /92757/);
  assert.equal(COUSINS.length, 4);
  assert.equal(COUSINS[0].state, "closed");
  assert.equal(COUSINS[1].state, "open");
  assert.equal(COUSINS[2].state, "closed");
  assert.equal(COUSINS[3].state, "open");
});

test("has-clear-repro chip from labels", () => {
  const out = decide({ seed: "has-clear-repro", hasClearRepro: true });
  assert.equal(out.verdict, "has-clear-repro");
  assert.match(out.reasons.join(" "), /has-clear-repro/);
  assert.match(out.reasons.join(" "), /has repro/);
});

test("analyze / score / handle / seeds / scoreFields", () => {
  const idle = analyze({});
  assert.equal(idle.verdict, "piped");
  assert.equal(score(seedUnbound()).verdict, "unbound");
  assert.equal(handle('{"seed":"swallowed","swallowed":true}').verdict, "swallowed");
  assert.equal(handle({ seed: "unbound", unbound: true }).verdict, "unbound");
  const bag = seeds();
  assert.equal(decide(bag.piped).verdict, "piped");
  assert.equal(decide(bag.swallowed).verdict, "swallowed");
  assert.equal(decide(bag.unbound).verdict, "unbound");
  assert.equal(scoreFields(seedSwallowed()).swallowed, true);
});

test("fingerprint and signals detect ptybind facts", () => {
  assert.equal(
    pipedSignal("idle plate is piped; pin idle piped; editor receives keys; input correctly handed to child"),
    true
  );
  assert.equal(
    swallowedSignal("keys swallowed; no keystroke reaches; receiving no keystrokes; parent still consuming input"),
    true
  );
  assert.equal(unboundSignal("plate already unbound; parent stdin fully torn down; editor gets keys"), true);
  assert.equal(editorRendersSignal("editor-renders renders correctly draws correctly"), true);
  assert.equal(keysDeadSignal("keys-dead i, Esc and Ctrl+C all dead"), true);
  assert.equal(parentConsumingSignal("parent-consuming parent was still consuming own prompt as a submitted"), true);
  assert.equal(conptyMuxSignal("conpty-mux psmux wtmux ConPTY multiplexer"), true);
  assert.equal(guiWorkaroundSignal("gui-workaround gvim -f GUI editor"), true);
  assert.equal(nodeReproSignal("node-repro 13-line Node repro.js stdio: 'inherit'"), true);
  assert.equal(controlMatrixSignal("control-matrix real tmux on WSL"), true);
  const hits = signals(seedSwallowed());
  assert.equal(hits.swallowed || hits.keysDead || hits.parentConsuming, true);
  const print = fingerprint(seedSwallowed());
  assert.equal(print.keysDead, true);
  assert.equal(print.swallowedHit, true);
  assert.equal(print.inputSwallowed, true);
});

test("fingerprint scores unbound plate path", () => {
  const print = fingerprint(seedUnbound());
  assert.equal(print.unboundClean, true);
  assert.equal(print.swallowedHit, false);
  const out = decide({ ...seedUnbound(), seed: "unbound" });
  assert.equal(out.unbound, true);
  assert.equal(out.verdict, "unbound");
  assert.equal(plateUnbound(seedUnbound()), true);
  assert.equal(plateUnbound(seedSwallowed()), false);
});

test("classify idle vs hold flags", () => {
  const alarm = classify(seedSwallowed());
  assert.equal(alarm.swallowed, true);
  const hold = classify(seedUnbound());
  assert.equal(hold.unbound, true);
  const idle = classify(seedPiped());
  assert.equal(idle.piped, true);
});

test("helpers encode keys dead + parent consuming", () => {
  assert.equal(keysWereDead(seedSwallowed()), true);
  assert.equal(parentStillConsuming(seedSwallowed()), true);
  assert.equal(keysWereDead(seedPiped()), false);
  assert.equal(parentStillConsuming(seedPiped()), false);
  assert.equal(keysWereDead({ keysDead: true }), true);
  assert.equal(parentStillConsuming({ parentConsuming: true }), true);
});

test("bind ledger encodes the issue split", () => {
  assert.ok(BIND_LEDGER.some((row) => row.id === "parent" && /raw-mode/i.test(row.role)));
  assert.ok(BIND_LEDGER.some((row) => row.id === "child" && /dead/i.test(row.tally)));
  assert.ok(BIND_LEDGER.some((row) => row.id === "unbound" && /torn down/i.test(row.note)));
  assert.ok(BIND_LEDGER.length === 3);
  assert.equal(CONTROL_MATRIX.length, 8);
  assert.equal(CONTROL_MATRIX.filter((row) => row.editorGetsInput === false).length, 2);
  assert.equal(CONTROL_MATRIX.filter((row) => row.editorGetsInput === true).length, 6);
});

test("measured facts from #92757", () => {
  assert.equal(MEASURED.issue, 92757);
  assert.equal(MEASURED.state, "open");
  assert.deepEqual(MEASURED.labels, ["bug", "has repro", "platform:windows", "area:tui"]);
  assert.equal(MEASURED.filed, "2026-09-08T01:32:11Z");
  assert.equal(MEASURED.claude, "Claude Code 2.1.263");
  assert.match(MEASURED.os, /Windows 11 Pro/);
  assert.match(MEASURED.os, /10\.0\.26200\.9168/);
  assert.match(MEASURED.terminal, /psmux/);
  assert.match(MEASURED.terminal, /wtmux/);
  assert.equal(MEASURED.editorRenders, true);
  assert.deepEqual(MEASURED.keysDead, ["i", "Esc", "Ctrl+C"]);
  assert.equal(MEASURED.sessionMustBeKilled, true);
  assert.equal(MEASURED.nonDeterministic, true);
  assert.equal(MEASURED.parentConsuming, true);
  assert.equal(MEASURED.nodeRepro, true);
  assert.equal(MEASURED.guiWorkaround, "gvim -f");
  assert.equal(MEASURED.node, "v24.19.0");
  assert.match(MEASURED.psmux, /3\.3\.8/);
  assert.equal(IDLE_WORD, "piped");
  assert.equal(SEEDED_WORD, "swallowed");
  assert.equal(ADMIT_WORD, "unbound");
});

test("HOLD is piped/unbound; ALARM is swallowed family", () => {
  assert.ok(HOLD.has("piped"));
  assert.ok(HOLD.has("unbound"));
  assert.equal(ALARM.has("piped"), false);
  assert.equal(ALARM.has("unbound"), false);
  for (const chip of [
    "swallowed",
    "editor-renders",
    "keys-dead",
    "parent-consuming",
    "conpty-mux",
    "gui-workaround",
    "node-repro",
    "control-matrix",
    "cousins",
    "has-clear-repro"
  ]) {
    assert.ok(ALARM.has(chip), chip);
  }
  assert.deepEqual(CHIPS, VERDICTS);
  assert.deepEqual(VERDICTS, [
    "piped",
    "swallowed",
    "unbound",
    "editor-renders",
    "keys-dead",
    "parent-consuming",
    "conpty-mux",
    "gui-workaround",
    "node-repro",
    "control-matrix",
    "has-clear-repro",
    "cousins"
  ]);
});

test("cousins table cites WezTerm, window-kill, hang, bg-spare", () => {
  assert.equal(COUSINS.length, 4);
  assert.ok(COUSINS.some((c) => c.id === 73301 && c.state === "closed"));
  assert.ok(COUSINS.some((c) => c.id === 84264 && c.state === "open"));
  assert.ok(COUSINS.some((c) => c.id === 58664 && c.state === "closed"));
  assert.ok(COUSINS.some((c) => c.id === 88775 && c.state === "open"));
});

test("fixtures encode issue facts and score their seeds", () => {
  const files = [
    "piped.json",
    "swallowed.json",
    "unbound.json",
    "92757.json",
    "editor-renders.json",
    "keys-dead.json",
    "parent-consuming.json",
    "conpty-mux.json",
    "gui-workaround.json",
    "node-repro.json",
    "control-matrix.json",
    "cousins.json",
    "fixtures.json",
    "has-clear-repro.json"
  ];
  for (const name of files) {
    const raw = readFileSync(join(root, "data", name), "utf8");
    assert.match(raw, /92757|ptybind|piped|swallowed|unbound/i);
    if (name !== "fixtures.json") {
      const fixture = JSON.parse(raw);
      const out = decide(fixture);
      assert.ok(VERDICTS.includes(out.verdict), `${name} → ${out.verdict}`);
    }
  }
  const index = JSON.parse(readFileSync(join(root, "data", "fixtures.json"), "utf8"));
  assert.equal(index.narrativeNotFixture.idle, "piped");
  assert.equal(index.narrativeNotFixture.seeded, "swallowed");
  assert.equal(index.narrativeNotFixture.noLiveSessions, true);
  assert.equal(index.narrativeNotFixture.noPayloads, true);
  assert.equal(index.narrativeNotFixture.noSecrets, true);
  assert.ok(index.narrativeNotFixture.labels.includes("has repro"));
  assert.ok(index.narrativeNotFixture.labels.includes("area:tui"));
  assert.ok(index.narrativeNotFixture.labels.includes("platform:windows"));
  const listed = readdirSync(join(root, "data"));
  assert.ok(listed.includes("README.md"));
});

test("living page is a phosphor ConPTY bind plate, not a clone", () => {
  assert.match(page, /Newsreader/);
  assert.match(page, /Karla/);
  assert.match(page, /IBM Plex Mono/);
  assert.doesNotMatch(page, /Literata/);
  assert.doesNotMatch(page, /Red Hat Text/);
  assert.doesNotMatch(page, /Fira Code/);
  assert.doesNotMatch(page, /Bitter/);
  assert.doesNotMatch(page, /Plus Jakarta/);
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
  assert.doesNotMatch(page, /Oswald/);
  assert.doesNotMatch(page, /Source Sans 3/);
  assert.doesNotMatch(page, /Big Shoulders Display/);
  assert.doesNotMatch(page, /Roboto Mono/);
  assert.match(page, /swallowed/);
  assert.match(page, /unbound/);
  assert.match(page, /\bpiped\b/);
  assert.match(page, /#92757/);
  assert.match(page, /Ptybind/);
  assert.match(page, /embed/);
  assert.match(page, /\?embed=1/);
  assert.match(page, /12:50 \/ hermes catalog #218 \/ #92757/);
  assert.match(page, /Score swallowed/);
  assert.match(page, /Admit unbound/);
  assert.match(page, /Pin idle piped/);
  assert.match(page, /Reset to piped/);
  assert.match(page, /Ctrl\+G/);
  assert.match(page, /ConPTY/);
  assert.match(page, /psmux/);
  assert.match(page, /wtmux/);
  assert.match(page, /PTY BIND/);
  assert.match(page, /phosphor/);
  assert.match(page, /cousin-not-primary/);
});

test("page stays off neighboring UIs and prior idle words", () => {
  assert.doesNotMatch(page, /stevedore's dunnage/i);
  assert.doesNotMatch(page, /dark hold timber/i);
  assert.doesNotMatch(page, /letterpress set-off/i);
  assert.doesNotMatch(page, /dampened tympan/i);
  assert.doesNotMatch(page, /locksmith's espagnolette/i);
  assert.doesNotMatch(page, /casement-fastener/i);
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
  assert.doesNotMatch(page, /print-shop \/ overstrike/i);
  assert.doesNotMatch(page, /woodworking/i);
  assert.doesNotMatch(page, /millimeter-slider/i);
  assert.doesNotMatch(page, /(?<!has-)\bclear\b/);
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
  assert.doesNotMatch(page, /\bcollated\b/);
  assert.doesNotMatch(page, /\bvacant\b/);
  assert.doesNotMatch(page, /\battentive\b/);
  assert.doesNotMatch(page, /\bdeaf\b/);
  assert.doesNotMatch(page, /\bremounted\b/);
  assert.doesNotMatch(page, /\bshed\b/);
  assert.doesNotMatch(page, /\bberthed\b/);
  assert.doesNotMatch(page, /\bechoed\b/);
  assert.doesNotMatch(page, /\badvanced\b/);
});

test("README anti-clone encodes the ptybind thesis", () => {
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /Ctrl\+G/);
  assert.match(readme, /ConPTY/);
  assert.match(readme, /How to score/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/ptybind\//);
  assert.match(readme, /Score swallowed or admit unbound/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /NOT Dunnage/);
  assert.match(readme, /NOT Setoff/);
  assert.match(readme, /NOT Espagnolette/);
  assert.match(readme, /NOT Imprimatur/);
  assert.match(readme, /NOT Byname/);
  assert.match(hookReadme, /piped/);
  assert.match(hookReadme, /swallowed/);
  assert.match(hookReadme, /unbound/);
  assert.match(dataReadme, /piped/);
  assert.match(dataReadme, /swallowed/);
  assert.match(dataReadme, /unbound/);
});
