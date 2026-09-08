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
  seedMatched,
  seedOrphaned,
  seedKeyed,
  fingerprint,
  signals,
  matchedSignal,
  orphanedSignal,
  keyedSignal,
  cliNamedMountSignal,
  desktopUuidMountSignal,
  askRuleSilentMissSignal,
  noStartupWarningSignal,
  uuidUndocumentedSignal,
  namedLedgerMatched,
  deskWasOrphaned,
  HOLD,
  ALARM,
  MEASURED,
  CHIPS,
  VERDICTS,
  COUSINS,
  NAMEPLATE_LEDGER,
  EVIDENCE_TABLE,
  IDLE_WORD,
  SEEDED_WORD,
  ADMIT_WORD
} from "./homonym.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const page = readFileSync(join(root, "index.html"), "utf8");
const readme = readFileSync(join(root, "README.md"), "utf8");
const hookReadme = readFileSync(join(root, "hook", "README.md"), "utf8");
const dataReadme = readFileSync(join(root, "data", "README.md"), "utf8");

test("primary 92787 fixture scores orphaned", () => {
  const primary = JSON.parse(readFileSync(join(root, "data", "92787.json"), "utf8"));
  const out = decide(primary);
  assert.equal(out.verdict, "orphaned");
  assert.equal(out.orphaned, true);
  assert.ok(out.chips.includes("orphaned"));
  assert.ok(ALARM.has(out.verdict));
});

test("empty / idle probe is matched", () => {
  const out = decide({});
  assert.equal(out.verdict, "matched");
  assert.equal(out.matched, true);
  assert.equal(out.orphaned, false);
  assert.ok(HOLD.has("matched"));
  assert.equal(IDLE_WORD, "matched");
});

test("matched fixture is hold", () => {
  const idle = JSON.parse(readFileSync(join(root, "data", "matched.json"), "utf8"));
  const out = decide(idle);
  assert.equal(out.verdict, "matched");
  assert.equal(out.matched, true);
  assert.ok(HOLD.has(out.verdict));
});

test("seeded orphaned scores orphaned", () => {
  const out = decide(seedOrphaned());
  assert.equal(out.verdict, "orphaned");
  assert.equal(out.orphaned, true);
  assert.ok(out.chips.includes("orphaned"));
  assert.ok(out.chips.includes("cli-named-mount"));
  assert.ok(out.chips.includes("desktop-uuid-mount"));
  assert.ok(ALARM.has(out.verdict));
});

test("keyed seed is a hold", () => {
  const out = decide(seedKeyed());
  assert.equal(out.verdict, "keyed");
  assert.equal(out.keyed, true);
  assert.equal(out.orphaned, false);
  assert.ok(HOLD.has(out.verdict));
  assert.equal(SEEDED_WORD, "orphaned");
  assert.equal(ADMIT_WORD, "keyed");
});

test("matched seed is idle hold", () => {
  const out = decide(seedMatched());
  assert.equal(out.verdict, "matched");
  assert.equal(out.matched, true);
  assert.ok(HOLD.has("matched"));
});

test("cli-named-mount chip", () => {
  const out = decide({ seed: "cli-named-mount", cliNamedMount: true });
  assert.equal(out.verdict, "cli-named-mount");
  assert.equal(out.orphaned, true);
  assert.match(out.reasons.join(" "), /claude_ai_Gmail/);
  assert.match(out.reasons.join(" "), /2\.1\.263/);
});

test("desktop-uuid-mount chip", () => {
  const out = decide({ seed: "desktop-uuid-mount", desktopUuidMount: true });
  assert.equal(out.verdict, "desktop-uuid-mount");
  assert.match(out.reasons.join(" "), /00f86eb0-3a3c-4c27-acda-6f24a36b05d7/);
  assert.match(out.reasons.join(" "), /claude-desktop/);
});

test("cli-named-mount vs desktop-uuid-mount contrast", () => {
  const cli = decide({ seed: "cli-named-mount", cliNamedMount: true });
  const desk = decide({ seed: "desktop-uuid-mount", desktopUuidMount: true });
  assert.equal(cli.verdict, "cli-named-mount");
  assert.equal(desk.verdict, "desktop-uuid-mount");
  assert.match(NAMEPLATE_LEDGER.find((c) => c.id === "named").tally, /claude_ai_Gmail/);
  assert.match(NAMEPLATE_LEDGER.find((c) => c.id === "ghost").tally, /00f86eb0/);
});

test("ask-rule-silent-miss chip", () => {
  const out = decide({ seed: "ask-rule-silent-miss", askRuleSilentMiss: true });
  assert.equal(out.verdict, "ask-rule-silent-miss");
  assert.match(out.reasons.join(" "), /silently ineffective/);
  assert.match(out.reasons.join(" "), /without a prompt/);
});

test("no-startup-warning chip", () => {
  const out = decide({ seed: "no-startup-warning", noStartupWarning: true });
  assert.equal(out.verdict, "no-startup-warning");
  assert.match(out.reasons.join(" "), /rule matches no tool/);
  assert.match(out.reasons.join(" "), /settings\.json/);
});

test("uuid-undocumented chip", () => {
  const out = decide({ seed: "uuid-undocumented", uuidUndocumented: true });
  assert.equal(out.verdict, "uuid-undocumented");
  assert.match(out.reasons.join(" "), /permissions#mcp/);
  assert.match(out.reasons.join(" "), /\/mcp/);
});

test("cousins cite-only #77598 CLOSED and #82532 OPEN", () => {
  const out = decide({
    seed: "cousins",
    cousinsCiteOnly: COUSINS
  });
  assert.equal(out.verdict, "cousins");
  assert.match(out.reasons.join(" "), /77598/);
  assert.match(out.reasons.join(" "), /82532/);
  assert.match(out.reasons.join(" "), /92787/);
  assert.equal(COUSINS.length, 2);
  assert.equal(COUSINS[0].state, "closed");
  assert.equal(COUSINS[0].id, 77598);
  assert.equal(COUSINS[1].state, "open");
  assert.equal(COUSINS[1].id, 82532);
});

test("has-clear-repro chip from labels", () => {
  const out = decide({ seed: "has-clear-repro", hasClearRepro: true });
  assert.equal(out.verdict, "has-clear-repro");
  assert.match(out.reasons.join(" "), /has-clear-repro/);
  assert.match(out.reasons.join(" "), /has repro/);
});

test("analyze / score / handle / seeds / scoreFields", () => {
  const idle = analyze({});
  assert.equal(idle.verdict, "matched");
  assert.equal(score(seedKeyed()).verdict, "keyed");
  assert.equal(handle('{"seed":"orphaned","orphaned":true}').verdict, "orphaned");
  assert.equal(handle({ seed: "keyed", keyed: true }).verdict, "keyed");
  const bag = seeds();
  assert.equal(decide(bag.matched).verdict, "matched");
  assert.equal(decide(bag.orphaned).verdict, "orphaned");
  assert.equal(decide(bag.keyed).verdict, "keyed");
  assert.equal(scoreFields(seedOrphaned()).orphaned, true);
});

test("fingerprint and signals detect homonym facts", () => {
  assert.equal(
    matchedSignal("idle desk is matched; pin idle matched; named ledger stays matched across entrypoints"),
    true
  );
  assert.equal(
    orphanedSignal("orphans the rule under a UUID guidon; named ask/deny rules silently miss"),
    true
  );
  assert.equal(keyedSignal("already keyed; same server name in every entrypoint"), true);
  assert.equal(cliNamedMountSignal("cli-named-mount claude_ai_Gmail entrypoint=cli"), true);
  assert.equal(
    desktopUuidMountSignal("desktop-uuid-mount 00f86eb0-3a3c-4c27-acda-6f24a36b05d7"),
    true
  );
  assert.equal(askRuleSilentMissSignal("ask-rule-silent-miss silently ineffective permissions.ask"), true);
  assert.equal(noStartupWarningSignal("no-startup-warning rule matches no tool settings.json"), true);
  assert.equal(uuidUndocumentedSignal("uuid-undocumented permissions#mcp not shown in /mcp"), true);
  const hits = signals(seedOrphaned());
  assert.equal(hits.orphaned || hits.desktopUuidMount || hits.askRuleSilentMiss, true);
  const print = fingerprint(seedOrphaned());
  assert.equal(print.orphanedHit, true);
  assert.equal(print.uuidGuidon, true);
});

test("fingerprint scores keyed desk path", () => {
  const print = fingerprint(seedKeyed());
  assert.equal(print.keyedClean, true);
  assert.equal(print.orphanedHit, false);
  const out = decide({ ...seedKeyed(), seed: "keyed" });
  assert.equal(out.keyed, true);
  assert.equal(out.verdict, "keyed");
  assert.equal(namedLedgerMatched(seedKeyed()), true);
  assert.equal(namedLedgerMatched(seedOrphaned()), false);
});

test("classify idle vs hold flags", () => {
  const alarm = classify(seedOrphaned());
  assert.equal(alarm.orphaned, true);
  const hold = classify(seedKeyed());
  assert.equal(hold.keyed, true);
  const idle = classify(seedMatched());
  assert.equal(idle.matched, true);
});

test("helpers encode UUID guidon + named ledger", () => {
  assert.equal(deskWasOrphaned(seedOrphaned()), true);
  assert.equal(deskWasOrphaned(seedMatched()), false);
  assert.equal(deskWasOrphaned({ orphaned: true }), true);
  assert.equal(namedLedgerMatched({ keyed: true }), true);
});

test("nameplate ledger encodes the issue split", () => {
  assert.ok(NAMEPLATE_LEDGER.some((row) => row.id === "named" && /claude_ai_/i.test(row.role)));
  assert.ok(NAMEPLATE_LEDGER.some((row) => row.id === "ghost" && /00f86eb0/i.test(row.tally)));
  assert.ok(NAMEPLATE_LEDGER.some((row) => row.id === "keyed" && /every entrypoint/i.test(row.tally)));
  assert.ok(NAMEPLATE_LEDGER.length === 3);
  assert.ok(EVIDENCE_TABLE.length >= 7);
  assert.equal(EVIDENCE_TABLE[0].uuidNamed, 522);
  assert.equal(EVIDENCE_TABLE[0].claudeAiNamed, 0);
  assert.equal(EVIDENCE_TABLE[5].uuidNamed, 0);
  assert.ok(EVIDENCE_TABLE[5].claudeAiNamed > 0);
});

test("measured facts from #92787", () => {
  assert.equal(MEASURED.issue, 92787);
  assert.equal(MEASURED.state, "open");
  assert.deepEqual(MEASURED.labels, [
    "bug",
    "has repro",
    "platform:macos",
    "area:mcp",
    "area:permissions",
    "area:desktop"
  ]);
  assert.equal(MEASURED.filed, "2026-09-08T05:58:51Z");
  assert.equal(MEASURED.cli, "2.1.263");
  assert.equal(MEASURED.desktop, "1.46388.4");
  assert.deepEqual(MEASURED.observedDesktopSessions, ["2.1.219", "2.1.260"]);
  assert.equal(MEASURED.os, "macOS 26.5.2");
  assert.equal(MEASURED.reporter, "honzapav");
  assert.equal(MEASURED.examples[0].uuid, "00f86eb0-3a3c-4c27-acda-6f24a36b05d7");
  assert.equal(MEASURED.examples[1].uuid, "4378a0e9-5968-4b33-9b01-6761445ef5f1");
  assert.equal(MEASURED.examples[2].uuid, "67cd082d-c902-4339-b9ff-cfe96708ca78");
  assert.equal(IDLE_WORD, "matched");
  assert.equal(SEEDED_WORD, "orphaned");
  assert.equal(ADMIT_WORD, "keyed");
});

test("HOLD is matched/keyed; ALARM is orphaned family", () => {
  assert.ok(HOLD.has("matched"));
  assert.ok(HOLD.has("keyed"));
  assert.equal(ALARM.has("matched"), false);
  assert.equal(ALARM.has("keyed"), false);
  for (const chip of [
    "orphaned",
    "cli-named-mount",
    "desktop-uuid-mount",
    "ask-rule-silent-miss",
    "no-startup-warning",
    "uuid-undocumented",
    "cousins",
    "has-clear-repro"
  ]) {
    assert.ok(ALARM.has(chip), chip);
  }
  assert.deepEqual(CHIPS, VERDICTS);
  assert.deepEqual(VERDICTS, [
    "matched",
    "orphaned",
    "keyed",
    "cli-named-mount",
    "desktop-uuid-mount",
    "ask-rule-silent-miss",
    "no-startup-warning",
    "uuid-undocumented",
    "has-clear-repro",
    "cousins"
  ]);
});

test("cousins table cites #77598 CLOSED and #82532 OPEN only", () => {
  assert.equal(COUSINS.length, 2);
  assert.ok(COUSINS.some((c) => c.id === 77598 && c.state === "closed"));
  assert.ok(COUSINS.some((c) => c.id === 82532 && c.state === "open"));
});

test("fixtures encode issue facts and score their seeds", () => {
  const files = [
    "matched.json",
    "orphaned.json",
    "keyed.json",
    "92787.json",
    "cli-named-mount.json",
    "desktop-uuid-mount.json",
    "ask-rule-silent-miss.json",
    "no-startup-warning.json",
    "uuid-undocumented.json",
    "cousins.json",
    "fixtures.json",
    "has-clear-repro.json"
  ];
  for (const name of files) {
    const raw = readFileSync(join(root, "data", name), "utf8");
    assert.match(raw, /92787|homonym|matched|orphaned|keyed/i);
    if (name !== "fixtures.json") {
      const fixture = JSON.parse(raw);
      const out = decide(fixture);
      assert.ok(VERDICTS.includes(out.verdict), `${name} → ${out.verdict}`);
    }
  }
  const index = JSON.parse(readFileSync(join(root, "data", "fixtures.json"), "utf8"));
  assert.equal(index.narrativeNotFixture.idle, "matched");
  assert.equal(index.narrativeNotFixture.seeded, "orphaned");
  assert.equal(index.narrativeNotFixture.noLiveSessions, true);
  assert.equal(index.narrativeNotFixture.noPayloads, true);
  assert.equal(index.narrativeNotFixture.noSecrets, true);
  assert.ok(index.narrativeNotFixture.labels.includes("has repro"));
  assert.ok(index.narrativeNotFixture.labels.includes("area:mcp"));
  assert.ok(index.narrativeNotFixture.labels.includes("area:permissions"));
  assert.ok(index.narrativeNotFixture.labels.includes("area:desktop"));
  const listed = readdirSync(join(root, "data"));
  assert.ok(listed.includes("README.md"));
});

test("living page is a lexicographer twin-nameplate desk, not a clone", () => {
  assert.match(page, /Fraunces/);
  assert.match(page, /Outfit/);
  assert.match(page, /JetBrains Mono/);
  assert.doesNotMatch(page, /EB Garamond/);
  assert.doesNotMatch(page, /Barlow/);
  assert.doesNotMatch(page, /Source Code Pro/);
  assert.doesNotMatch(page, /Lora/);
  assert.doesNotMatch(page, /Plus Jakarta/);
  assert.doesNotMatch(page, /Cousine/);
  assert.doesNotMatch(page, /Newsreader/);
  assert.doesNotMatch(page, /Karla/);
  assert.doesNotMatch(page, /IBM Plex Mono/);
  assert.doesNotMatch(page, /Literata/);
  assert.doesNotMatch(page, /Red Hat Text/);
  assert.doesNotMatch(page, /Fira Code/);
  assert.doesNotMatch(page, /DM Serif Display/);
  assert.doesNotMatch(page, /Commissioner/);
  assert.doesNotMatch(page, /Azeret/);
  assert.doesNotMatch(page, /Instrument Serif/);
  assert.doesNotMatch(page, /Figtree/);
  assert.doesNotMatch(page, /Playfair/);
  assert.doesNotMatch(page, /DM Sans/);
  assert.doesNotMatch(page, /Bodoni Moda/);
  assert.doesNotMatch(page, /Nunito/);
  assert.doesNotMatch(page, /Cormorant/);
  assert.doesNotMatch(page, /Manrope/);
  assert.doesNotMatch(page, /Ibarra/);
  assert.match(page, /orphaned/);
  assert.match(page, /keyed/);
  assert.match(page, /\bmatched\b/);
  assert.match(page, /#92787/);
  assert.match(page, /Homonym/);
  assert.match(page, /embed/);
  assert.match(page, /\?embed=1/);
  assert.match(page, /16:50 \/ hermes catalog #222 \/ #92787/);
  assert.match(page, /Score orphaned/);
  assert.match(page, /Admit keyed/);
  assert.match(page, /Pin idle matched/);
  assert.match(page, /Reset to matched/);
  assert.match(page, /claude_ai_Gmail/);
  assert.match(page, /00f86eb0-3a3c-4c27-acda-6f24a36b05d7/);
  assert.match(page, /parchment/);
  assert.match(page, /nameplate/);
  assert.match(page, /cousin-not-primary/);
});

test("page stays off neighboring UIs and prior idle words", () => {
  assert.doesNotMatch(page, /PTY BIND/);
  assert.doesNotMatch(page, /ivory-and-ebony/i);
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
  assert.doesNotMatch(page, /piano cream/i);
  assert.doesNotMatch(page, /CRT phosphor/i);
  assert.doesNotMatch(page, /marble cistern/i);
  assert.doesNotMatch(page, /soot\/ember/);
  assert.doesNotMatch(page, /(?<!has-)\bclear\b/);
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
  assert.doesNotMatch(page, /\bcorked\b/);
  assert.doesNotMatch(page, /\blatent\b/);
  assert.doesNotMatch(page, /\bsilted\b/);
  assert.doesNotMatch(page, /\bbarred\b/);
  assert.doesNotMatch(page, /\brunaway\b/);
  assert.doesNotMatch(page, /\bhaunted\b/);
  assert.doesNotMatch(page, /\bfouled\b/);
  assert.doesNotMatch(page, /\brazed\b/);
  assert.doesNotMatch(page, /\bculled\b/);
  assert.doesNotMatch(page, /\bunanswered\b/);
  assert.doesNotMatch(page, /\bstripped\b/);
  assert.doesNotMatch(page, /\bquieted\b/);
  assert.doesNotMatch(page, /\bcribbed\b/);
  assert.doesNotMatch(page, /\bsprung\b/);
  assert.doesNotMatch(page, /\bremoored\b/);
  assert.doesNotMatch(page, /\baddressed\b/);
  assert.doesNotMatch(page, /\breaped\b/);
  assert.doesNotMatch(page, /\brelayed\b/);
  assert.doesNotMatch(page, /\bflushed\b/);
  assert.doesNotMatch(page, /\bdrained\b/);
  assert.doesNotMatch(page, /\badmitted\b/);
  assert.doesNotMatch(page, /\bambered\b/);
  assert.doesNotMatch(page, /\bbynamed\b/);
  assert.doesNotMatch(page, /\bcrenelled\b/);
  assert.doesNotMatch(page, /\blatched\b/);
  assert.doesNotMatch(page, /\bstaged\b/);
  assert.doesNotMatch(page, /\bproved\b/);
  assert.doesNotMatch(page, /\bbelayed\b/);
  assert.doesNotMatch(page, /\bsole\b/);
  assert.doesNotMatch(page, /\bpacked\b/);
  assert.doesNotMatch(page, /\broused\b/);
  assert.doesNotMatch(page, /\bsighted\b/);
  assert.doesNotMatch(page, /\bargbound\b/);
  assert.doesNotMatch(page, /\bcleared\b/);
  assert.doesNotMatch(page, /\bporous\b/);
  assert.doesNotMatch(page, /\bslipped\b/);
  assert.doesNotMatch(page, /\bsevered\b/);
  assert.doesNotMatch(page, /\bmisrouted\b/);
  assert.doesNotMatch(page, /\badrift\b/);
  assert.doesNotMatch(page, /\bdripping\b/);
  assert.doesNotMatch(page, /\barrested\b/);
  assert.doesNotMatch(page, /\bcredited\b/);
});

test("README anti-clone encodes the homonym thesis", () => {
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /claude_ai_/);
  assert.match(readme, /connection UUID/);
  assert.match(readme, /How to score/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/homonym\//);
  assert.match(readme, /Score orphaned or admit keyed/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /NOT Clepsydra/);
  assert.match(readme, /NOT Letoff/);
  assert.match(readme, /NOT Ptybind/);
  assert.match(readme, /NOT Dunnage/);
  assert.match(readme, /NOT Setoff/);
  assert.match(readme, /NOT Espagnolette/);
  assert.match(hookReadme, /matched/);
  assert.match(hookReadme, /orphaned/);
  assert.match(hookReadme, /keyed/);
  assert.match(dataReadme, /matched/);
  assert.match(dataReadme, /orphaned/);
  assert.match(dataReadme, /keyed/);
});
