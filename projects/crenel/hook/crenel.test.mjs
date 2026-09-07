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
  seedBricked,
  seedCrenelled,
  fingerprint,
  signals,
  brickedSignal,
  crenelledSignal,
  emptyObjectCapabilitySignal,
  listNoResourcesSignal,
  readUnsupportedSignal,
  toolsStillWorkSignal,
  stdioListChangedWorksSignal,
  wireCurlOkSignal,
  assertCapabilityTruthySignal,
  upstreamRejectSignal,
  instructionsTruncatedProofSignal,
  crenelCrenelled,
  courseAdmits,
  HOLD,
  ALARM,
  MEASURED,
  CHIPS,
  VERDICTS,
  COUSINS,
  WIRE,
  CAPABILITY_COURSES,
  IDLE_WORD,
  SEEDED_WORD
} from "./crenel.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const page = readFileSync(join(root, "index.html"), "utf8");
const readme = readFileSync(join(root, "README.md"), "utf8");
const hookReadme = readFileSync(join(root, "hook", "README.md"), "utf8");
const dataReadme = readFileSync(join(root, "data", "README.md"), "utf8");

test("primary 92729 fixture scores bricked", () => {
  const primary = JSON.parse(readFileSync(join(root, "data", "92729.json"), "utf8"));
  const out = decide(primary);
  assert.equal(out.verdict, "bricked");
  assert.equal(out.bricked, true);
  assert.ok(out.chips.includes("bricked"));
});

test("empty / idle probe is bricked", () => {
  const out = decide({});
  assert.equal(out.verdict, "bricked");
  assert.equal(out.bricked, true);
  assert.equal(out.crenelled, false);
  assert.ok(ALARM.has("bricked"));
  assert.equal(IDLE_WORD, "bricked");
});

test("seeded bricked scores bricked", () => {
  const out = decide(seedBricked());
  assert.equal(out.verdict, "bricked");
  assert.equal(out.bricked, true);
  assert.ok(out.chips.includes("bricked"));
  assert.ok(out.chips.includes("list-no-resources"));
  assert.ok(out.chips.includes("read-unsupported"));
});

test("crenelled seed is a hold", () => {
  const out = decide(seedCrenelled());
  assert.equal(out.verdict, "crenelled");
  assert.equal(out.crenelled, true);
  assert.equal(out.bricked, false);
  assert.ok(HOLD.has(out.verdict));
  assert.equal(SEEDED_WORD, "crenelled");
});

test("empty-object-capability chip", () => {
  const out = decide({ seed: "empty-object-capability", emptyObjectCapability: true });
  assert.equal(out.verdict, "empty-object-capability");
  assert.equal(out.bricked, true);
  assert.match(out.reasons.join(" "), /resources:\{\}/);
  assert.match(out.reasons.join(" "), /spec-legal/);
});

test("list-no-resources chip", () => {
  const out = decide({ seed: "list-no-resources", listNoResources: true });
  assert.equal(out.verdict, "list-no-resources");
  assert.match(out.reasons.join(" "), /ListMcpResourcesTool/);
  assert.match(out.reasons.join(" "), /No resources found/);
});

test("read-unsupported chip", () => {
  const out = decide({ seed: "read-unsupported", readUnsupported: true });
  assert.equal(out.verdict, "read-unsupported");
  assert.match(out.reasons.join(" "), /ReadMcpResourceTool/);
  assert.match(out.reasons.join(" "), /does not support resources/);
});

test("tools-still-work chip", () => {
  const out = decide({ seed: "tools-still-work", toolsStillWork: true });
  assert.equal(out.verdict, "tools-still-work");
  assert.match(out.reasons.join(" "), /tools\/\*/);
});

test("stdio-listChanged-works chip", () => {
  const out = decide({ seed: "stdio-listChanged-works", stdioListChangedWorks: true });
  assert.equal(out.verdict, "stdio-listChanged-works");
  assert.match(out.reasons.join(" "), /listChanged":false/);
  assert.match(out.reasons.join(" "), /stdio/);
});

test("wire-curl-ok chip", () => {
  const out = decide({ seed: "wire-curl-ok", wireCurlOk: true });
  assert.equal(out.verdict, "wire-curl-ok");
  assert.match(out.reasons.join(" "), /HTTP 200/);
  assert.match(out.reasons.join(" "), /mcp-remote 0\.1\.38/);
});

test("assertCapability-truthy chip", () => {
  const out = decide({ seed: "assertCapability-truthy", assertCapabilityTruthy: true });
  assert.equal(out.verdict, "assertCapability-truthy");
  assert.match(out.reasons.join(" "), /assertCapability/);
  assert.match(out.reasons.join(" "), /truthy/);
});

test("upstream-reject chip", () => {
  const out = decide({ seed: "upstream-reject", upstreamReject: true });
  assert.equal(out.verdict, "upstream-reject");
  assert.match(out.reasons.join(" "), /upstream/);
  assert.match(out.reasons.join(" "), /NON-BINDING/);
});

test("instructions-truncated-proof chip", () => {
  const out = decide({ seed: "instructions-truncated-proof", instructionsTruncatedProof: true });
  assert.equal(out.verdict, "instructions-truncated-proof");
  assert.match(out.reasons.join(" "), /2221/);
  assert.match(out.reasons.join(" "), /2048/);
});

test("cousins cite-only", () => {
  const out = decide({
    seed: "cousins",
    cousinsCiteOnly: [85230, 80300, 88128]
  });
  assert.equal(out.verdict, "cousins");
  assert.match(out.reasons.join(" "), /#85230/);
  assert.match(out.reasons.join(" "), /#80300/);
  assert.match(out.reasons.join(" "), /#88128/);
  assert.match(out.reasons.join(" "), /Quietus/);
  assert.match(out.reasons.join(" "), /Catachresis/);
});

test("has-clear-repro chip from labels", () => {
  const out = decide({ seed: "has-clear-repro", hasClearRepro: true });
  assert.equal(out.verdict, "has-clear-repro");
  assert.match(out.reasons.join(" "), /has-clear-repro/);
  assert.match(out.reasons.join(" "), /has repro/);
});

test("analyze / score / handle / seeds / scoreFields", () => {
  const idle = analyze({});
  assert.equal(idle.verdict, "bricked");
  assert.equal(score(seedCrenelled()).verdict, "crenelled");
  assert.equal(handle('{"seed":"bricked","bricked":true}').verdict, "bricked");
  assert.equal(handle({ seed: "crenelled", crenelled: true }).verdict, "crenelled");
  const bag = seeds();
  assert.equal(decide(bag.bricked).verdict, "bricked");
  assert.equal(decide(bag.crenelled).verdict, "crenelled");
  assert.equal(scoreFields(seedBricked()).bricked, true);
});

test("fingerprint and signals detect crenel facts", () => {
  assert.equal(
    brickedSignal("ALARM: crenel bricked; walled over; treated as absent; stays bricked"),
    true
  );
  assert.equal(
    crenelledSignal("crenel already crenelled; acknowledged as support; notch admits"),
    true
  );
  assert.equal(
    emptyObjectCapabilitySignal('empty-object-capability resources:{} empty object'),
    true
  );
  assert.equal(listNoResourcesSignal("list-no-resources ListMcpResourcesTool No resources found"), true);
  assert.equal(
    readUnsupportedSignal("read-unsupported ReadMcpResourceTool does not support resources"),
    true
  );
  assert.equal(toolsStillWorkSignal("tools-still-work tools/* from the same server"), true);
  assert.equal(
    stdioListChangedWorksSignal("stdio-listChanged-works listChanged:false stdio neighbour"),
    true
  );
  assert.equal(wireCurlOkSignal("wire-curl-ok curl initialize HTTP 200 resourceTemplates"), true);
  assert.equal(
    assertCapabilityTruthySignal("assertCapability-truthy assertCapability truthy _capabilities.resources"),
    true
  );
  assert.equal(upstreamRejectSignal("upstream-reject something upstream of SDK"), true);
  assert.equal(
    instructionsTruncatedProofSignal("instructions-truncated-proof truncated from 2221 2048 chars"),
    true
  );
  const hits = signals(seedBricked());
  assert.equal(hits.bricked || hits.listNoResources || hits.emptyObjectCapability, true);
  const print = fingerprint(seedBricked());
  assert.equal(print.listNoResources, true);
  assert.equal(print.brickedHit, true);
});

test("fingerprint scores crenelled clean notch-admits path", () => {
  const print = fingerprint(seedCrenelled());
  assert.equal(print.crenelledClean, true);
  assert.equal(print.brickedHit, false);
  const out = decide({ ...seedCrenelled(), seed: "crenelled" });
  assert.equal(out.crenelled, true);
  assert.equal(out.verdict, "crenelled");
  assert.equal(crenelCrenelled(seedCrenelled()), true);
  assert.equal(crenelCrenelled(seedBricked()), false);
});

test("classify idle vs hold flags", () => {
  const idle = classify(seedBricked());
  assert.equal(idle.bricked, true);
  const hold = classify(seedCrenelled());
  assert.equal(hold.crenelled, true);
});

test("courseAdmits encodes fails vs stdio works", () => {
  assert.equal(courseAdmits("fails"), false);
  assert.equal(courseAdmits("works"), true);
  assert.equal(courseAdmits("unknown"), null);
});

test("capability courses are fails / works", () => {
  assert.ok(CAPABILITY_COURSES.length === 2);
  assert.ok(CAPABILITY_COURSES.some((row) => row.id === "fails" && row.listed === false));
  assert.ok(CAPABILITY_COURSES.some((row) => row.id === "works" && row.listed === true));
});

test("wire table encodes curl HTTP 200 facts", () => {
  assert.ok(WIRE.length >= 4);
  assert.equal(WIRE[0].id, "initialize");
  assert.equal(WIRE[0].http, 200);
  assert.ok(WIRE.some((row) => row.id === "list" && row.http === 200));
  assert.ok(WIRE.some((row) => row.id === "read" && row.http === 200));
  assert.ok(WIRE.some((row) => row.id === "templates" && row.http === 200));
});

test("measured facts from #92729", () => {
  assert.equal(MEASURED.issue, 92729);
  assert.equal(MEASURED.state, "open");
  assert.deepEqual(MEASURED.labels, [
    "bug",
    "has repro",
    "platform:macos",
    "area:mcp"
  ]);
  assert.equal(MEASURED.filed, "2026-09-07T20:19:27Z");
  assert.equal(MEASURED.updated, "2026-09-07T20:20:22Z");
  assert.equal(MEASURED.reporter, "juancastroG");
  assert.equal(MEASURED.comments, 0);
  assert.equal(MEASURED.os, "macOS 15");
  assert.equal(MEASURED.darwin, "25.4.0");
  assert.equal(MEASURED.platform, "macos");
  assert.equal(MEASURED.serverRuntime, "Rust + rmcp 3.1.4");
  assert.equal(MEASURED.transport, "Streamable HTTP");
  assert.equal(MEASURED.legacySessionMode, false);
  assert.equal(MEASURED.jsonResponse, true);
  assert.deepEqual(MEASURED.failingCapabilities, { resources: {}, tools: {} });
  assert.deepEqual(MEASURED.workingStdioCapabilities, {
    resources: { listChanged: false },
    tools: { listChanged: false }
  });
  assert.equal(MEASURED.bothSpecLegal, true);
  assert.equal(MEASURED.toolsFromSameServerWork, true);
  assert.equal(MEASURED.otherStdioServerResourcesListed, true);
  assert.equal(MEASURED.wireHttpStatus, 200);
  assert.equal(MEASURED.assertCapabilityTreatsEmptyObjectTruthy, true);
  assert.equal(MEASURED.assertCapabilityIsNotTheRejector, true);
  assert.equal(MEASURED.upstreamDecidesNoResources, true);
  assert.equal(MEASURED.instructionsTruncatedFrom, 2221);
  assert.equal(MEASURED.instructionsTruncatedTo, 2048);
  assert.equal(MEASURED.mcpRemoteVersion, "0.1.38");
  assert.deepEqual(MEASURED.protocolVersionsTried, [
    "2024-11-05",
    "2025-06-18",
    "2025-11-25",
    "2026-07-28"
  ]);
  assert.equal(IDLE_WORD, "bricked");
  assert.equal(SEEDED_WORD, "crenelled");
});

test("HOLD is crenelled; ALARM is bricked family", () => {
  assert.ok(HOLD.has("crenelled"));
  assert.equal(ALARM.has("crenelled"), false);
  for (const chip of [
    "bricked",
    "empty-object-capability",
    "list-no-resources",
    "read-unsupported",
    "tools-still-work",
    "stdio-listChanged-works",
    "wire-curl-ok",
    "assertCapability-truthy",
    "upstream-reject",
    "instructions-truncated-proof",
    "cousins",
    "has-clear-repro"
  ]) {
    assert.ok(ALARM.has(chip), chip);
  }
  assert.deepEqual(CHIPS, VERDICTS);
  assert.deepEqual(VERDICTS, [
    "bricked",
    "crenelled",
    "empty-object-capability",
    "list-no-resources",
    "read-unsupported",
    "tools-still-work",
    "stdio-listChanged-works",
    "wire-curl-ok",
    "assertCapability-truthy",
    "upstream-reject",
    "instructions-truncated-proof",
    "cousins",
    "has-clear-repro"
  ]);
});

test("cousins table is cite-only 85230 / 80300 / 88128", () => {
  assert.deepEqual(
    COUSINS.map((c) => c.id),
    [85230, 80300, 88128]
  );
});

test("fixtures encode issue facts and score their seeds", () => {
  const files = [
    "bricked.json",
    "crenelled.json",
    "92729.json",
    "empty-object-capability.json",
    "list-no-resources.json",
    "read-unsupported.json",
    "tools-still-work.json",
    "stdio-listChanged-works.json",
    "wire-curl-ok.json",
    "assertCapability-truthy.json",
    "upstream-reject.json",
    "instructions-truncated-proof.json",
    "cousins.json",
    "fixtures.json",
    "has-clear-repro.json"
  ];
  for (const name of files) {
    const raw = readFileSync(join(root, "data", name), "utf8");
    assert.match(raw, /92729|crenel|bricked|crenelled/i);
    if (name !== "fixtures.json") {
      const fixture = JSON.parse(raw);
      const out = decide(fixture);
      assert.ok(VERDICTS.includes(out.verdict), `${name} → ${out.verdict}`);
    }
  }
  const index = JSON.parse(readFileSync(join(root, "data", "fixtures.json"), "utf8"));
  assert.equal(index.narrativeNotFixture.idle, "bricked");
  assert.equal(index.narrativeNotFixture.seeded, "crenelled");
  assert.equal(index.narrativeNotFixture.noLiveSessions, true);
  assert.equal(index.narrativeNotFixture.noPayloads, true);
  assert.equal(index.narrativeNotFixture.noSecrets, true);
  assert.ok(index.narrativeNotFixture.labels.includes("has repro"));
  assert.ok(index.narrativeNotFixture.labels.includes("area:mcp"));
  const listed = readdirSync(join(root, "data"));
  assert.ok(listed.includes("README.md"));
});

test("living page is a mason crenel bench, not a clone", () => {
  assert.match(page, /Ibarra Real Nova/);
  assert.match(page, /Plus Jakarta Sans/);
  assert.match(page, /Geist Mono/);
  assert.match(page, /IBM Plex Mono/);
  assert.doesNotMatch(page, /Cardo/);
  assert.doesNotMatch(page, /Fragment Mono/);
  assert.doesNotMatch(page, /Young Serif/);
  assert.doesNotMatch(page, /Karla/);
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
  assert.doesNotMatch(page, /Fraunces/);
  assert.doesNotMatch(page, /JetBrains Mono/);
  assert.doesNotMatch(page, /Cinzel Decorative/);
  assert.doesNotMatch(page, /Public Sans/);
  assert.match(page, /bricked/);
  assert.match(page, /crenelled/);
  assert.match(page, /#92729/);
  assert.match(page, /Crenel/);
  assert.match(page, /embed/);
  assert.match(page, /\?embed=1/);
  assert.match(page, /06:50 \/ hermes catalog #212 \/ #92729/);
  assert.match(page, /Score the crenel/);
  assert.match(page, /Pin idle bricked/);
  assert.match(page, /Pin seeded crenelled/);
  assert.match(page, /Admit crenelled/);
  assert.match(page, /Load fixtures/);
  assert.match(page, /Reset to crenelled/);
  assert.match(page, /Open the embrasure/);
  assert.match(page, /Wall the crenel/);
  assert.match(page, /crenel|mason|battlement|chalk|dusk|BRICKED|CRENELLED/i);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /85230/);
  assert.match(page, /80300/);
  assert.match(page, /88128/);
  assert.match(page, /ListMcpResourcesTool/);
  assert.match(page, /ReadMcpResourceTool/);
  assert.match(page, /resources:\{\}/);
});

test("page stays off neighboring UIs and prior idle words", () => {
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
});

test("README anti-clone encodes the crenel thesis", () => {
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /resources:\{\}/);
  assert.match(readme, /juancastroG/);
  assert.match(readme, /#85230/);
  assert.match(readme, /#80300/);
  assert.match(readme, /#88128/);
  assert.match(readme, /How to score/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/crenel\//);
  assert.match(readme, /Score bricked or admit crenelled/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /NOT Quietus/);
  assert.match(readme, /NOT Cribble/);
  assert.match(readme, /NOT Springe/);
  assert.match(readme, /NOT Catachresis/);
  assert.match(hookReadme, /bricked/);
  assert.match(hookReadme, /crenelled/);
  assert.match(dataReadme, /bricked/);
  assert.match(dataReadme, /crenelled/);
});
