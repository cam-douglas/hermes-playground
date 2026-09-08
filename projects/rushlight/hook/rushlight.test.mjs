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
  seedLit,
  seedSnuffed,
  seedTenured,
  fingerprint,
  signals,
  litSignal,
  snuffedSignal,
  tenuredSignal,
  sessionScopedSignal,
  sameVersionRepromptSignal,
  startupEnumerationSignal,
  fdaIneffectiveSignal,
  childWorkerSignal,
  sconceTenured,
  rushWasSnuffed,
  sessionScopedInvalid,
  HOLD,
  ALARM,
  MEASURED,
  CHIPS,
  VERDICTS,
  COUSINS,
  SCONCE_LEDGER,
  PROMPT_TABLE,
  IDLE_WORD,
  SEEDED_WORD,
  ADMIT_WORD
} from "./rushlight.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const page = readFileSync(join(root, "index.html"), "utf8");
const readme = readFileSync(join(root, "README.md"), "utf8");
const hookReadme = readFileSync(join(root, "hook", "README.md"), "utf8");
const dataReadme = readFileSync(join(root, "data", "README.md"), "utf8");

test("primary 92784 fixture scores snuffed", () => {
  const primary = JSON.parse(readFileSync(join(root, "data", "92784.json"), "utf8"));
  const out = decide(primary);
  assert.equal(out.verdict, "snuffed");
  assert.equal(out.snuffed, true);
  assert.ok(out.chips.includes("snuffed"));
  assert.ok(ALARM.has(out.verdict));
});

test("empty / idle probe is lit", () => {
  const out = decide({});
  assert.equal(out.verdict, "lit");
  assert.equal(out.lit, true);
  assert.equal(out.snuffed, false);
  assert.ok(HOLD.has("lit"));
  assert.equal(IDLE_WORD, "lit");
});

test("lit fixture is hold", () => {
  const idle = JSON.parse(readFileSync(join(root, "data", "lit.json"), "utf8"));
  const out = decide(idle);
  assert.equal(out.verdict, "lit");
  assert.equal(out.lit, true);
  assert.ok(HOLD.has(out.verdict));
});

test("seeded snuffed scores snuffed", () => {
  const out = decide(seedSnuffed());
  assert.equal(out.verdict, "snuffed");
  assert.equal(out.snuffed, true);
  assert.ok(out.chips.includes("snuffed"));
  assert.ok(out.chips.includes("session-scoped-auth-invalid"));
  assert.ok(out.chips.includes("same-version-reprompt"));
  assert.ok(ALARM.has(out.verdict));
});

test("tenured seed is a hold", () => {
  const out = decide(seedTenured());
  assert.equal(out.verdict, "tenured");
  assert.equal(out.tenured, true);
  assert.equal(out.snuffed, false);
  assert.ok(HOLD.has(out.verdict));
  assert.equal(SEEDED_WORD, "snuffed");
  assert.equal(ADMIT_WORD, "tenured");
});

test("lit seed is idle hold", () => {
  const out = decide(seedLit());
  assert.equal(out.verdict, "lit");
  assert.equal(out.lit, true);
  assert.ok(HOLD.has("lit"));
});

test("session-scoped-auth-invalid chip", () => {
  const out = decide({ seed: "session-scoped-auth-invalid", sessionScopedAuthInvalid: true });
  assert.equal(out.verdict, "session-scoped-auth-invalid");
  assert.equal(out.snuffed, true);
  assert.match(out.reasons.join(" "), /kTCCServiceSystemPolicyAppData/);
  assert.match(out.reasons.join(" "), /Session scoped auth is invalid/);
});

test("same-version-reprompt chip", () => {
  const out = decide({ seed: "same-version-reprompt", sameVersionReprompt: true });
  assert.equal(out.verdict, "same-version-reprompt");
  assert.match(out.reasons.join(" "), /18 minutes/);
  assert.match(out.reasons.join(" "), /2\.1\.258/);
});

test("startup-appdata-enumeration vs fda-desktop-ineffective contrast", () => {
  const startup = decide({
    seed: "startup-appdata-enumeration",
    startupAppdataEnumeration: true
  });
  const fda = decide({ seed: "fda-desktop-ineffective", fdaDesktopIneffective: true });
  assert.equal(startup.verdict, "startup-appdata-enumeration");
  assert.equal(fda.verdict, "fda-desktop-ineffective");
  assert.equal(SCONCE_LEDGER.find((c) => c.id === "wick").tally, "session-scoped then invalid");
  assert.match(SCONCE_LEDGER.find((c) => c.id === "sconce").tally, /com\.anthropic\.claude-code/);
});

test("startup-appdata-enumeration chip", () => {
  const out = decide({
    seed: "startup-appdata-enumeration",
    startupAppdataEnumeration: true
  });
  assert.equal(out.verdict, "startup-appdata-enumeration");
  assert.match(out.reasons.join(" "), /CallHistoryDB/);
  assert.match(out.reasons.join(" "), /Mail/);
});

test("fda-desktop-ineffective chip", () => {
  const out = decide({ seed: "fda-desktop-ineffective", fdaDesktopIneffective: true });
  assert.equal(out.verdict, "fda-desktop-ineffective");
  assert.match(out.reasons.join(" "), /\/Applications\/Claude\.app/);
  assert.match(out.reasons.join(" "), /66216/);
});

test("child-worker-identity chip", () => {
  const out = decide({ seed: "child-worker-identity", childWorkerIdentity: true });
  assert.equal(out.verdict, "child-worker-identity");
  assert.match(out.reasons.join(" "), /Q6L2SF6YDW/);
  assert.match(out.reasons.join(" "), /disclaimer helper/);
});

test("cousins cite-only neighbourhood", () => {
  const out = decide({
    seed: "cousins",
    cousinsCiteOnly: COUSINS
  });
  assert.equal(out.verdict, "cousins");
  assert.match(out.reasons.join(" "), /63130/);
  assert.match(out.reasons.join(" "), /92784/);
  assert.equal(COUSINS.length, 6);
  assert.equal(COUSINS[0].id, 63130);
  assert.equal(COUSINS[0].state, "open");
  assert.ok(COUSINS.some((c) => c.id === 66216 && c.state === "closed"));
});

test("has-clear-repro chip from labels", () => {
  const out = decide({ seed: "has-clear-repro", hasClearRepro: true });
  assert.equal(out.verdict, "has-clear-repro");
  assert.match(out.reasons.join(" "), /has-clear-repro/);
  assert.match(out.reasons.join(" "), /has repro/);
});

test("analyze / score / handle / seeds / scoreFields", () => {
  const idle = analyze({});
  assert.equal(idle.verdict, "lit");
  assert.equal(score(seedTenured()).verdict, "tenured");
  assert.equal(handle('{"seed":"snuffed","snuffed":true}').verdict, "snuffed");
  assert.equal(handle({ seed: "tenured", tenured: true }).verdict, "tenured");
  const bag = seeds();
  assert.equal(decide(bag.lit).verdict, "lit");
  assert.equal(decide(bag.snuffed).verdict, "snuffed");
  assert.equal(decide(bag.tenured).verdict, "tenured");
  assert.equal(scoreFields(seedSnuffed()).snuffed, true);
});

test("fingerprint and signals detect rushlight facts", () => {
  assert.equal(
    litSignal("idle sconce is lit; pin idle lit; TCC AppData grant persists across sessions of the same version"),
    true
  );
  assert.equal(
    snuffedSignal("rush snuffed; session-scoped grant evaporates; Session scoped auth is invalid; re-prompts every session"),
    true
  );
  assert.equal(tenuredSignal("already tenured; grant durable across sessions"), true);
  assert.equal(sessionScopedSignal("session-scoped-auth-invalid AUTHREQ_CTX kTCCServiceSystemPolicyAppData"), true);
  assert.equal(sameVersionRepromptSignal("same-version-reprompt 18 minutes later 4 prompts across 2 days"), true);
  assert.equal(startupEnumerationSignal("startup-appdata-enumeration CallHistoryDB kernel denials at startup"), true);
  assert.equal(fdaIneffectiveSignal("fda-desktop-ineffective Full Disk Access on /Applications/Claude.app does NOT help"), true);
  assert.equal(childWorkerSignal("child-worker-identity disclaimer helper Q6L2SF6YDW"), true);
  const hits = signals(seedSnuffed());
  assert.equal(hits.snuffed || hits.sessionScoped || hits.sameVersionReprompt, true);
  const print = fingerprint(seedSnuffed());
  assert.equal(print.snuffedHit, true);
  assert.equal(print.rushSnuffed, true);
});

test("fingerprint scores tenured sconce path", () => {
  const print = fingerprint(seedTenured());
  assert.equal(print.tenuredClean, true);
  assert.equal(print.snuffedHit, false);
  const out = decide({ ...seedTenured(), seed: "tenured" });
  assert.equal(out.tenured, true);
  assert.equal(out.verdict, "tenured");
  assert.equal(sconceTenured(seedTenured()), true);
  assert.equal(sconceTenured(seedSnuffed()), false);
});

test("classify idle vs hold flags", () => {
  const alarm = classify(seedSnuffed());
  assert.equal(alarm.snuffed, true);
  const hold = classify(seedTenured());
  assert.equal(hold.tenured, true);
  const idle = classify(seedLit());
  assert.equal(idle.lit, true);
});

test("helpers encode rush snuff + session-scoped invalid", () => {
  assert.equal(rushWasSnuffed(seedSnuffed()), true);
  assert.equal(sessionScopedInvalid(seedSnuffed()), true);
  assert.equal(rushWasSnuffed(seedLit()), false);
  assert.equal(rushWasSnuffed({ snuffed: true }), true);
  assert.equal(sessionScopedInvalid({ sessionScopedAuthInvalid: true }), true);
});

test("sconce ledger encodes the issue split", () => {
  assert.ok(SCONCE_LEDGER.some((row) => row.id === "wick" && /TCC AppData/i.test(row.role)));
  assert.ok(SCONCE_LEDGER.some((row) => row.id === "sconce" && /claude-code/i.test(row.tally)));
  assert.ok(SCONCE_LEDGER.some((row) => row.id === "tenured" && /same version/i.test(row.note)));
  assert.ok(SCONCE_LEDGER.length === 3);
  assert.equal(PROMPT_TABLE.length, 3);
  assert.equal(PROMPT_TABLE[0].version, "2.1.258");
  assert.match(PROMPT_TABLE[1].when, /18 minutes/);
  assert.match(PROMPT_TABLE[2].when, /4 prompts/);
});

test("measured facts from #92784", () => {
  assert.equal(MEASURED.issue, 92784);
  assert.equal(MEASURED.state, "open");
  assert.deepEqual(MEASURED.labels, [
    "bug",
    "has repro",
    "platform:macos",
    "area:packaging",
    "area:desktop"
  ]);
  assert.equal(MEASURED.filed, "2026-09-08T05:47:57Z");
  assert.match(MEASURED.claude, /2\.1\.258/);
  assert.match(MEASURED.os, /26\.5\.2/);
  assert.match(MEASURED.os, /25F84/);
  assert.equal(MEASURED.bundleId, "com.anthropic.claude-code");
  assert.match(MEASURED.responsiblePath, /2\.1\.258/);
  assert.match(MEASURED.signature, /Q6L2SF6YDW/);
  assert.equal(MEASURED.tccService, "kTCCServiceSystemPolicyAppData");
  assert.equal(MEASURED.tccdInvalid, "Session scoped auth is invalid for client");
  assert.equal(MEASURED.afterAllow.authValue, 2);
  assert.equal(MEASURED.afterAllow.authReason, 2);
  assert.equal(MEASURED.laterSameVersionMinutes, 18);
  assert.equal(MEASURED.promptsObserved, 4);
  assert.equal(MEASURED.daysObserved, 2);
  assert.equal(MEASURED.fdaHelps, false);
  assert.ok(MEASURED.kernelDenials.includes("Mail"));
  assert.ok(MEASURED.kernelDenials.includes("CallHistoryDB"));
  assert.equal(IDLE_WORD, "lit");
  assert.equal(SEEDED_WORD, "snuffed");
  assert.equal(ADMIT_WORD, "tenured");
});

test("HOLD is lit/tenured; ALARM is snuffed family", () => {
  assert.ok(HOLD.has("lit"));
  assert.ok(HOLD.has("tenured"));
  assert.equal(ALARM.has("lit"), false);
  assert.equal(ALARM.has("tenured"), false);
  for (const chip of [
    "snuffed",
    "session-scoped-auth-invalid",
    "same-version-reprompt",
    "startup-appdata-enumeration",
    "fda-desktop-ineffective",
    "child-worker-identity",
    "cousins",
    "has-clear-repro"
  ]) {
    assert.ok(ALARM.has(chip), chip);
  }
  assert.deepEqual(CHIPS, VERDICTS);
  assert.deepEqual(VERDICTS, [
    "lit",
    "snuffed",
    "tenured",
    "session-scoped-auth-invalid",
    "same-version-reprompt",
    "startup-appdata-enumeration",
    "fda-desktop-ineffective",
    "child-worker-identity",
    "has-clear-repro",
    "cousins"
  ]);
});

test("cousins table cites six tickets; primary stays #92784", () => {
  assert.equal(COUSINS.length, 6);
  assert.ok(COUSINS.some((c) => c.id === 63130 && c.state === "open"));
  assert.ok(COUSINS.some((c) => c.id === 66216 && c.state === "closed"));
  assert.ok(COUSINS.some((c) => c.id === 36832 && c.state === "closed"));
  assert.ok(COUSINS.some((c) => c.id === 36675 && c.state === "closed"));
  assert.ok(COUSINS.some((c) => c.id === 41297 && c.state === "closed"));
  assert.ok(COUSINS.some((c) => c.id === 59608 && c.state === "closed"));
});

test("fixtures encode issue facts and score their seeds", () => {
  const files = [
    "lit.json",
    "snuffed.json",
    "tenured.json",
    "92784.json",
    "session-scoped-auth-invalid.json",
    "same-version-reprompt.json",
    "startup-appdata-enumeration.json",
    "fda-desktop-ineffective.json",
    "child-worker-identity.json",
    "cousins.json",
    "fixtures.json",
    "has-clear-repro.json"
  ];
  for (const name of files) {
    const raw = readFileSync(join(root, "data", name), "utf8");
    assert.match(raw, /92784|rushlight|lit|snuffed|tenured/i);
    if (name !== "fixtures.json") {
      const fixture = JSON.parse(raw);
      const out = decide(fixture);
      assert.ok(VERDICTS.includes(out.verdict), `${name} → ${out.verdict}`);
    }
  }
  const index = JSON.parse(readFileSync(join(root, "data", "fixtures.json"), "utf8"));
  assert.equal(index.narrativeNotFixture.idle, "lit");
  assert.equal(index.narrativeNotFixture.seeded, "snuffed");
  assert.equal(index.narrativeNotFixture.noLiveSessions, true);
  assert.equal(index.narrativeNotFixture.noPayloads, true);
  assert.equal(index.narrativeNotFixture.noSecrets, true);
  assert.ok(index.narrativeNotFixture.labels.includes("has repro"));
  assert.ok(index.narrativeNotFixture.labels.includes("area:packaging"));
  assert.ok(index.narrativeNotFixture.labels.includes("platform:macos"));
  const listed = readdirSync(join(root, "data"));
  assert.ok(listed.includes("README.md"));
});

test("living page is an iron sconce rush atelier, not a clone", () => {
  assert.match(page, /Petrona/);
  assert.match(page, /Manrope/);
  assert.match(page, /IBM Plex Mono/);
  assert.doesNotMatch(page, /EB Garamond/);
  assert.doesNotMatch(page, /Barlow/);
  assert.doesNotMatch(page, /Source Code Pro/);
  assert.doesNotMatch(page, /Lora/);
  assert.doesNotMatch(page, /Plus Jakarta/);
  assert.doesNotMatch(page, /Cousine/);
  assert.doesNotMatch(page, /Newsreader/);
  assert.doesNotMatch(page, /Karla/);
  assert.doesNotMatch(page, /Literata/);
  assert.doesNotMatch(page, /Red Hat Text/);
  assert.doesNotMatch(page, /Fira Code/);
  assert.doesNotMatch(page, /DM Serif Display/);
  assert.doesNotMatch(page, /Commissioner/);
  assert.doesNotMatch(page, /Azeret/);
  assert.doesNotMatch(page, /Instrument Serif/);
  assert.doesNotMatch(page, /Figtree/);
  assert.doesNotMatch(page, /JetBrains/);
  assert.doesNotMatch(page, /Playfair/);
  assert.doesNotMatch(page, /DM Sans/);
  assert.doesNotMatch(page, /Bodoni Moda/);
  assert.doesNotMatch(page, /Nunito/);
  assert.doesNotMatch(page, /Cormorant/);
  assert.doesNotMatch(page, /Outfit/);
  assert.doesNotMatch(page, /Spectral/);
  assert.doesNotMatch(page, /Fraunces/);
  assert.match(page, /snuffed/);
  assert.match(page, /tenured/);
  assert.match(page, /\blit\b/);
  assert.match(page, /#92784/);
  assert.match(page, /Rushlight/);
  assert.match(page, /embed/);
  assert.match(page, /\?embed=1/);
  assert.match(page, /15:50 \/ hermes catalog #221 \/ #92784/);
  assert.match(page, /Score snuffed/);
  assert.match(page, /Admit tenured/);
  assert.match(page, /Pin idle lit/);
  assert.match(page, /Reset to lit/);
  assert.match(page, /kTCCServiceSystemPolicyAppData/);
  assert.match(page, /Session scoped auth is invalid/);
  assert.match(page, /2\.1\.258/);
  assert.match(page, /sconce/i);
  assert.match(page, /rushlight/i);
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
  assert.doesNotMatch(page, /water-clock/i);
  assert.doesNotMatch(page, /teal water/i);
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
  assert.doesNotMatch(page, /\bburning\b/);
  assert.doesNotMatch(page, /\bgranted\b/);
  assert.doesNotMatch(page, /\bglowing\b/);
  assert.doesNotMatch(page, /\bdripping\b/);
  assert.doesNotMatch(page, /\barrested\b/);
  assert.doesNotMatch(page, /\bcredited\b/);
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
});

test("README anti-clone encodes the rushlight thesis", () => {
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /SystemPolicyAppData/);
  assert.match(readme, /session-scoped/);
  assert.match(readme, /How to score/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/rushlight\//);
  assert.match(readme, /Score snuffed or admit tenured/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /NOT Clepsydra/);
  assert.match(readme, /NOT Letoff/);
  assert.match(readme, /NOT Ptybind/);
  assert.match(readme, /NOT Dunnage/);
  assert.match(hookReadme, /lit/);
  assert.match(hookReadme, /snuffed/);
  assert.match(hookReadme, /tenured/);
  assert.match(dataReadme, /lit/);
  assert.match(dataReadme, /snuffed/);
  assert.match(dataReadme, /tenured/);
});
