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
  seedPorous,
  seedCribbed,
  fingerprint,
  signals,
  porousSignal,
  cribbedSignal,
  literalEaccesSignal,
  trailErofsSignal,
  midStar2Signal,
  midStar1Signal,
  denyReadMidSignal,
  statusActiveSignal,
  warningMisstatesSignal,
  toolVsBashSignal,
  cribbleCribbed,
  cellEnforced,
  HOLD,
  ALARM,
  MEASURED,
  CHIPS,
  VERDICTS,
  COUSINS,
  DENY_WRITE_TABLE,
  DENY_READ_TABLE,
  MESHES,
  IDLE_WORD,
  SEEDED_WORD
} from "./cribble.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const page = readFileSync(join(root, "index.html"), "utf8");
const readme = readFileSync(join(root, "README.md"), "utf8");
const hookReadme = readFileSync(join(root, "hook", "README.md"), "utf8");
const dataReadme = readFileSync(join(root, "data", "README.md"), "utf8");

test("primary 92684 fixture scores porous", () => {
  const primary = JSON.parse(readFileSync(join(root, "data", "92684.json"), "utf8"));
  const out = decide(primary);
  assert.equal(out.verdict, "porous");
  assert.equal(out.porous, true);
  assert.ok(out.chips.includes("porous"));
});

test("empty / idle probe is porous", () => {
  const out = decide({});
  assert.equal(out.verdict, "porous");
  assert.equal(out.porous, true);
  assert.equal(out.cribbed, false);
  assert.ok(ALARM.has("porous"));
  assert.equal(IDLE_WORD, "porous");
});

test("seeded porous scores porous", () => {
  const out = decide(seedPorous());
  assert.equal(out.verdict, "porous");
  assert.equal(out.porous, true);
  assert.ok(out.chips.includes("porous"));
  assert.ok(out.chips.includes("mid-star2-writable"));
  assert.ok(out.chips.includes("mid-star1-writable"));
});

test("cribbed seed is a hold", () => {
  const out = decide(seedCribbed());
  assert.equal(out.verdict, "cribbed");
  assert.equal(out.cribbed, true);
  assert.equal(out.porous, false);
  assert.ok(HOLD.has(out.verdict));
  assert.equal(SEEDED_WORD, "cribbed");
});

test("literal-eacces chip", () => {
  const out = decide({ seed: "literal-eacces", literalEacces: true });
  assert.equal(out.verdict, "literal-eacces");
  assert.equal(out.porous, true);
  assert.match(out.reasons.join(" "), /blocked:EACCES/);
  assert.match(out.reasons.join(" "), /literal/);
});

test("trail-erofs chip", () => {
  const out = decide({ seed: "trail-erofs", trailErofs: true });
  assert.equal(out.verdict, "trail-erofs");
  assert.match(out.reasons.join(" "), /blocked:EROFS/);
  assert.match(out.reasons.join(" "), /[Tt]railing/);
});

test("mid-star2-writable chip", () => {
  const out = decide({ seed: "mid-star2-writable", midStar2Writable: true });
  assert.equal(out.verdict, "mid-star2-writable");
  assert.ok(out.chips.includes("mid-star2-writable"));
  assert.match(out.reasons.join(" "), /\/\*\*\/probe\.txt/);
  assert.match(out.reasons.join(" "), /WRITABLE/);
});

test("mid-star1-writable chip", () => {
  const out = decide({ seed: "mid-star1-writable", midStar1Writable: true });
  assert.equal(out.verdict, "mid-star1-writable");
  assert.match(out.reasons.join(" "), /\/\*\/probe\.txt/);
  assert.match(out.reasons.join(" "), /WRITABLE/);
});

test("denyread-mid-enforced chip", () => {
  const out = decide({ seed: "denyread-mid-enforced", denyReadMidEnforced: true });
  assert.equal(out.verdict, "denyread-mid-enforced");
  assert.match(out.reasons.join(" "), /denyRead/);
  assert.match(out.reasons.join(" "), /blocked:EACCES/);
});

test("status-shows-active chip", () => {
  const out = decide({ seed: "status-shows-active", statusShowsActive: true });
  assert.equal(out.verdict, "status-shows-active");
  assert.match(out.reasons.join(" "), /\/status/);
  assert.match(out.reasons.join(" "), /active/);
});

test("warning-misstates-read chip", () => {
  const out = decide({ seed: "warning-misstates-read", warningMisstatesRead: true });
  assert.equal(out.verdict, "warning-misstates-read");
  assert.match(out.reasons.join(" "), /Edit\/Read/);
  assert.match(out.reasons.join(" "), /[Oo]verstates Read/);
});

test("tool-vs-bash-asymmetry chip", () => {
  const out = decide({ seed: "tool-vs-bash-asymmetry", toolVsBashAsymmetry: true });
  assert.equal(out.verdict, "tool-vs-bash-asymmetry");
  assert.match(out.reasons.join(" "), /permissions\.deny/);
  assert.match(out.reasons.join(" "), /Bash subprocess/);
});

test("cousins cite-only", () => {
  const out = decide({
    seed: "cousins",
    cousinsCiteOnly: [84863, 74081, 89762, 81266, 85761, 86054]
  });
  assert.equal(out.verdict, "cousins");
  assert.match(out.reasons.join(" "), /#84863/);
  assert.match(out.reasons.join(" "), /#74081/);
  assert.match(out.reasons.join(" "), /#89762/);
  assert.match(out.reasons.join(" "), /#81266/);
  assert.match(out.reasons.join(" "), /#85761/);
  assert.match(out.reasons.join(" "), /#86054/);
  assert.match(out.reasons.join(" "), /Springe/);
  assert.match(out.reasons.join(" "), /Gangway/);
});

test("has-clear-repro chip from labels", () => {
  const out = decide({ seed: "has-clear-repro", hasClearRepro: true });
  assert.equal(out.verdict, "has-clear-repro");
  assert.match(out.reasons.join(" "), /has-clear-repro/);
  assert.match(out.reasons.join(" "), /has repro/);
});

test("analyze / score / handle / seeds / scoreFields", () => {
  const idle = analyze({});
  assert.equal(idle.verdict, "porous");
  assert.equal(score(seedCribbed()).verdict, "cribbed");
  assert.equal(handle('{"seed":"porous","porous":true}').verdict, "porous");
  assert.equal(handle({ seed: "cribbed", cribbed: true }).verdict, "cribbed");
  const bag = seeds();
  assert.equal(decide(bag.porous).verdict, "porous");
  assert.equal(decide(bag.cribbed).verdict, "cribbed");
  assert.equal(scoreFields(seedPorous()).porous, true);
});

test("fingerprint and signals detect cribble facts", () => {
  assert.equal(
    porousSignal("ALARM: cribble porous; silently dropped; WRITABLE; mid-path"),
    true
  );
  assert.equal(cribbedSignal("deny correctly enforced; mesh taut; grit cribbed; cribbed"), true);
  assert.equal(literalEaccesSignal("literal-eacces blocked:EACCES literal path"), true);
  assert.equal(trailErofsSignal("trail-erofs blocked:EROFS trailing ** docs/**"), true);
  assert.equal(midStar2Signal("mid-star2-writable /**/probe.txt mid-path **"), true);
  assert.equal(midStar1Signal("mid-star1-writable /*/probe.txt mid-path *"), true);
  assert.equal(
    denyReadMidSignal("denyread-mid-enforced denyRead mid-path denyRead blocked:EACCES"),
    true
  );
  assert.equal(statusActiveSignal("status-shows-active /status as if it were active"), true);
  assert.equal(
    warningMisstatesSignal("warning-misstates-read Edit/Read will be ignored overstates Read"),
    true
  );
  assert.equal(
    toolVsBashSignal("tool-vs-bash-asymmetry permissions.deny Bash subprocess remains writable"),
    true
  );
  const hits = signals(seedPorous());
  assert.equal(hits.porous || hits.midStar2 || hits.midStar1, true);
  const print = fingerprint(seedPorous());
  assert.equal(print.midStar2Writable, true);
  assert.equal(print.porousHit, true);
});

test("fingerprint scores cribbed clean mesh-taut path", () => {
  const print = fingerprint(seedCribbed());
  assert.equal(print.cribbedClean, true);
  assert.equal(print.porousHit, false);
  const out = decide({ ...seedCribbed(), seed: "cribbed" });
  assert.equal(out.cribbed, true);
  assert.equal(out.verdict, "cribbed");
  assert.equal(cribbleCribbed(seedCribbed()), true);
  assert.equal(cribbleCribbed(seedPorous()), false);
});

test("classify idle vs hold flags", () => {
  const idle = classify(seedPorous());
  assert.equal(idle.porous, true);
  const hold = classify(seedCribbed());
  assert.equal(hold.cribbed, true);
});

test("cellEnforced encodes the published denyWrite / denyRead tables", () => {
  assert.equal(cellEnforced("denyWrite", "literal"), true);
  assert.equal(cellEnforced("denyWrite", "mid-path-**"), false);
  assert.equal(cellEnforced("denyWrite", "mid-path-*"), false);
  assert.equal(cellEnforced("denyWrite", "trailing-**"), true);
  assert.equal(cellEnforced("denyRead", "literal"), true);
  assert.equal(cellEnforced("denyRead", "mid-path-**"), true);
  assert.equal(cellEnforced("denyRead", "mid-path-*"), true);
  assert.equal(cellEnforced("unknown", "literal"), null);
});

test("meshes are literal / mesh / trail", () => {
  assert.ok(MESHES.length === 3);
  assert.ok(MESHES.some((row) => row.id === "literal" && row.taut === true));
  assert.ok(MESHES.some((row) => row.id === "mesh" && row.taut === false));
  assert.ok(MESHES.some((row) => row.id === "trail" && row.taut === true));
});

test("denyWrite table has five published rows", () => {
  assert.equal(DENY_WRITE_TABLE.length, 5);
  assert.equal(DENY_WRITE_TABLE[0].result, "blocked:EACCES");
  assert.equal(DENY_WRITE_TABLE[1].result, "WRITABLE");
  assert.equal(DENY_WRITE_TABLE[2].result, "WRITABLE");
  assert.equal(DENY_WRITE_TABLE[3].result, "blocked:EROFS");
  assert.equal(DENY_WRITE_TABLE[4].result, "blocked:EROFS");
});

test("denyRead table all enforced EACCES", () => {
  assert.equal(DENY_READ_TABLE.length, 3);
  assert.ok(DENY_READ_TABLE.every((row) => row.result === "blocked:EACCES" && row.enforced));
});

test("measured facts from #92684", () => {
  assert.equal(MEASURED.issue, 92684);
  assert.equal(MEASURED.state, "open");
  assert.deepEqual(MEASURED.labels, [
    "bug",
    "has repro",
    "platform:linux",
    "area:security",
    "area:sandbox"
  ]);
  assert.equal(MEASURED.filed, "2026-09-07T15:21:07Z");
  assert.equal(MEASURED.updated, "2026-09-07T15:22:53Z");
  assert.equal(MEASURED.reporter, "Danubian-Narwhal");
  assert.equal(MEASURED.comments, 0);
  assert.equal(MEASURED.platform, "linux-arm64");
  assert.equal(MEASURED.container, "node:22-bookworm-slim");
  assert.equal(MEASURED.claudeCodeLive, "2.1.263");
  assert.equal(MEASURED.commit, "37ae3f38d765");
  assert.equal(MEASURED.sandboxVia, "managed-settings");
  assert.equal(MEASURED.bubblewrapNested, true);
  assert.equal(MEASURED.midStar2Result, "WRITABLE");
  assert.equal(MEASURED.midStar1Result, "WRITABLE");
  assert.equal(MEASURED.literalResult, "blocked:EACCES");
  assert.equal(MEASURED.trailStar2Result, "blocked:EROFS");
  assert.equal(MEASURED.denyReadMidStar2, "blocked:EACCES");
  assert.equal(MEASURED.statusShowsActive, true);
  assert.equal(MEASURED.warningOverstatesRead, true);
  assert.equal(MEASURED.toolLayerWriteBlocked, true);
  assert.equal(MEASURED.bashSubprocessWritable, true);
  assert.equal(IDLE_WORD, "porous");
  assert.equal(SEEDED_WORD, "cribbed");
});

test("HOLD is cribbed; ALARM is porous family", () => {
  assert.ok(HOLD.has("cribbed"));
  assert.equal(ALARM.has("cribbed"), false);
  for (const chip of [
    "porous",
    "literal-eacces",
    "trail-erofs",
    "mid-star2-writable",
    "mid-star1-writable",
    "denyread-mid-enforced",
    "status-shows-active",
    "warning-misstates-read",
    "tool-vs-bash-asymmetry",
    "cousins",
    "has-clear-repro"
  ]) {
    assert.ok(ALARM.has(chip), chip);
  }
  assert.deepEqual(CHIPS, VERDICTS);
  assert.deepEqual(VERDICTS, [
    "porous",
    "cribbed",
    "literal-eacces",
    "trail-erofs",
    "mid-star2-writable",
    "mid-star1-writable",
    "denyread-mid-enforced",
    "status-shows-active",
    "warning-misstates-read",
    "tool-vs-bash-asymmetry",
    "cousins",
    "has-clear-repro"
  ]);
});

test("cousins table is cite-only 84863 / 74081 / 89762 / 81266 / 85761 / 86054", () => {
  assert.deepEqual(
    COUSINS.map((c) => c.id),
    [84863, 74081, 89762, 81266, 85761, 86054]
  );
  assert.equal(COUSINS.filter((c) => c.state === "open").length, 3);
  assert.equal(COUSINS.filter((c) => c.state === "closed").length, 3);
});

test("fixtures encode issue facts and score their seeds", () => {
  const files = [
    "porous.json",
    "cribbed.json",
    "92684.json",
    "literal-eacces.json",
    "trail-erofs.json",
    "mid-star2-writable.json",
    "mid-star1-writable.json",
    "denyread-mid-enforced.json",
    "status-shows-active.json",
    "warning-misstates-read.json",
    "tool-vs-bash-asymmetry.json",
    "cousins.json",
    "fixtures.json",
    "has-clear-repro.json"
  ];
  for (const name of files) {
    const raw = readFileSync(join(root, "data", name), "utf8");
    assert.match(raw, /92684|cribble|porous|cribbed/i);
    if (name !== "fixtures.json") {
      const fixture = JSON.parse(raw);
      const out = decide(fixture);
      assert.ok(VERDICTS.includes(out.verdict), `${name} → ${out.verdict}`);
    }
  }
  const index = JSON.parse(readFileSync(join(root, "data", "fixtures.json"), "utf8"));
  assert.equal(index.narrativeNotFixture.idle, "porous");
  assert.equal(index.narrativeNotFixture.seeded, "cribbed");
  assert.equal(index.narrativeNotFixture.noLiveSessions, true);
  assert.equal(index.narrativeNotFixture.noPayloads, true);
  assert.equal(index.narrativeNotFixture.noSecrets, true);
  assert.ok(index.narrativeNotFixture.labels.includes("has repro"));
  assert.ok(index.narrativeNotFixture.labels.includes("area:security"));
  assert.ok(index.narrativeNotFixture.labels.includes("area:sandbox"));
  const listed = readdirSync(join(root, "data"));
  assert.ok(listed.includes("README.md"));
});

test("living page is a mill cribble bench, not a clone", () => {
  assert.match(page, /Young Serif/);
  assert.match(page, /Karla/);
  assert.match(page, /IBM Plex Mono/);
  assert.doesNotMatch(page, /Oswald/);
  assert.doesNotMatch(page, /Source Sans 3/);
  assert.doesNotMatch(page, /Newsreader/);
  assert.doesNotMatch(page, /Figtree/);
  assert.doesNotMatch(page, /Fragment Mono/);
  assert.doesNotMatch(page, /Big Shoulders Display/);
  assert.doesNotMatch(page, /Public Sans/);
  assert.doesNotMatch(page, /Roboto Mono/);
  assert.doesNotMatch(page, /Petrona/);
  assert.doesNotMatch(page, /Lexend/);
  assert.doesNotMatch(page, /Azeret Mono/);
  assert.doesNotMatch(page, /Instrument Serif/);
  assert.doesNotMatch(page, /Plus Jakarta Sans/);
  assert.doesNotMatch(page, /Fraunces/);
  assert.doesNotMatch(page, /JetBrains Mono/);
  assert.doesNotMatch(page, /Bitter/);
  assert.doesNotMatch(page, /Manrope/);
  assert.doesNotMatch(page, /Bodoni Moda/);
  assert.doesNotMatch(page, /Nunito Sans/);
  assert.match(page, /porous/);
  assert.match(page, /cribbed/);
  assert.match(page, /#92684/);
  assert.match(page, /Cribble/);
  assert.match(page, /embed/);
  assert.match(page, /\?embed=1/);
  assert.match(page, /03:50 \/ hermes catalog #210 \/ #92684/);
  assert.match(page, /Score the cribble/);
  assert.match(page, /Pin idle porous/);
  assert.match(page, /Pin seeded cribbed/);
  assert.match(page, /Admit cribbed/);
  assert.match(page, /Load fixtures/);
  assert.match(page, /Reset to cribbed/);
  assert.match(page, /Dust the mesh/);
  assert.match(page, /Crib the grit/);
  assert.match(page, /cribble|flour|oak|mesh|mill|POROUS|CRIBBED/i);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /84863/);
  assert.match(page, /74081/);
  assert.match(page, /89762/);
  assert.match(page, /81266/);
  assert.match(page, /85761/);
  assert.match(page, /86054/);
  assert.match(page, /denyWrite/);
  assert.match(page, /denyRead/);
  assert.match(page, /WRITABLE/);
  assert.match(page, /blocked:EACCES/);
  assert.match(page, /blocked:EROFS/);
});

test("page stays off neighboring UIs and prior idle words", () => {
  assert.doesNotMatch(page, /snatch-block/i);
  assert.doesNotMatch(page, /openable pulley/i);
  assert.doesNotMatch(page, /freight waybill/i);
  assert.doesNotMatch(page, /pier gangway/i);
  assert.doesNotMatch(page, /phosphor persistence/i);
  assert.doesNotMatch(page, /afterimage test card/i);
  assert.doesNotMatch(page, /brass speakpipe/i);
  assert.doesNotMatch(page, /speaking-tube/i);
  assert.doesNotMatch(page, /trapper's springe/i);
  assert.doesNotMatch(page, /snare-setter/i);
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
  assert.doesNotMatch(page, /\bmisrouted\b/);
  assert.doesNotMatch(page, /\baddressed\b/);
  assert.doesNotMatch(page, /\bsevered\b/);
  assert.doesNotMatch(page, /\bremoored\b/);
  assert.doesNotMatch(page, /\bslipped\b/);
  assert.doesNotMatch(page, /\bsprung\b/);
});

test("README anti-clone encodes the cribble thesis", () => {
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /denyWrite/);
  assert.match(readme, /mid-path/);
  assert.match(readme, /Danubian-Narwhal/);
  assert.match(readme, /#84863/);
  assert.match(readme, /#74081/);
  assert.match(readme, /#89762/);
  assert.match(readme, /How to score/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/cribble\//);
  assert.match(readme, /Score porous or admit cribbed/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /NOT Springe/);
  assert.match(readme, /NOT Gangway/);
  assert.match(hookReadme, /porous/);
  assert.match(hookReadme, /cribbed/);
  assert.match(dataReadme, /porous/);
  assert.match(dataReadme, /cribbed/);
});
