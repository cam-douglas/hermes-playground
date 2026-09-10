import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  AGENT_COUNT,
  ALARM,
  AUTHOR,
  BACKUPS,
  CACHE_CREATE,
  CACHE_READ,
  CHILD_COUNT,
  CHIPS,
  CLAUDE_VERSION,
  COUSINS,
  FEATURED_ISSUE,
  FILED,
  FINDER_ANGLES,
  FINGERPRINT_LINES,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  GRANT_STATIONS,
  HOLD,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  NOT_PRODUCTS,
  OS,
  PARENT_MODEL,
  PATH_WORD,
  PHRASE,
  APPANAGE_WALK,
  PRODUCT_WORD,
  SEEDED_WORD,
  SKILL,
  SKILL_ARGS,
  STATE,
  TITLE,
  VERDICTS,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  inspectGrant,
  readGrant,
  readCadency,
  score,
  scoreGate,
  scoreWalk,
  seedRouted,
  seedCascade,
  seedAppanage,
  seedHold,
  seedInherited,
  seedModelAbsent,
  seedCostGateMissing,
  seedSelfInvoke,
  seedForkPolicyBlind,
  seedFinderOnFable,
  seedVerifierOnFable,
} from "./appanage.mjs";

function readData(name) {
  return JSON.parse(
    readFileSync(fileURLToPath(new URL(`./data/${name}`, import.meta.url)), "utf8"),
  );
}

function readPage() {
  return readFileSync(fileURLToPath(new URL("./index.html", import.meta.url)), "utf8");
}

function readReadme() {
  return readFileSync(fileURLToPath(new URL("./README.md", import.meta.url)), "utf8");
}

function readCatalog() {
  return JSON.parse(
    readFileSync(fileURLToPath(new URL("../../catalog.json", import.meta.url)), "utf8"),
  );
}

function readVercel() {
  return JSON.parse(
    readFileSync(fileURLToPath(new URL("../../vercel.json", import.meta.url)), "utf8"),
  );
}

function modelPath() {
  return fileURLToPath(new URL("./appanage.mjs", import.meta.url));
}

test("idle routed is a hold; children carry an explicit cheaper model", () => {
  const result = analyze(seedRouted());
  assert.equal(result.verdict, "routed");
  assert.equal(result.idleWord, "routed");
  assert.equal(IDLE_WORD, "routed");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.routed, true);
  assert.equal(result.phrase, "admit routed");
  assert.equal(result.costGate, true);
  assert.equal(result.policyReaches, true);
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify routed", () => {
  assert.equal(classify(emptyTicket()), "routed");
  assert.equal(classify(""), "routed");
  assert.equal(classify(null), "routed");
  assert.equal(decide({}), "routed");
});

test("#93307 seeded path scores inherited when Agent calls omit model", () => {
  const result = analyze(seedInherited());
  assert.equal(result.verdict, "inherited");
  assert.equal(result.seededWord, "inherited");
  assert.equal(SEEDED_WORD, "inherited");
  assert.equal(PRODUCT_WORD, "appanage");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.inherited, true);
  assert.equal(result.phrase, "score appanage");
  assert.equal(result.parentFable, true);
  assert.equal(result.selfInvoke, true);
  assert.equal(result.modelAbsent, true);
  assert.equal(result.finderOnFable, true);
  assert.equal(result.verifierOnFable, true);
  assert.equal(result.forkPolicyBlind, true);
  assert.equal(result.agents, 10);
  assert.equal(result.cacheCreate, 1533907);
  assert.equal(result.cacheRead, 13651479);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("parent fable plus model-absent is the #93307 inherit", () => {
  const span = inspectGrant({
    inherited: true,
    modelAbsent: true,
    parentFable: true,
    selfInvoke: true,
    finderOnFable: true,
    agents: 10,
  });
  assert.equal(span.routed, false);
  assert.equal(span.inherited, true);
  assert.equal(span.stamp, "inherited");
  const scored = scoreGate({
    inherited: true,
    parentFable: true,
    selfInvoke: true,
    modelAbsent: true,
    finderOnFable: true,
    verifierOnFable: true,
    forkPolicyBlind: true,
    agents: 10,
    cue: "inherited",
  });
  assert.equal(scored.verdict, "inherited");
  assert.equal(scored.modelAbsent, true);
  const calm = inspectGrant({
    childrenRouted: true,
    costGate: true,
    policyReaches: true,
    inherited: false,
    modelAbsent: false,
  });
  assert.equal(calm.routed, true);
  assert.equal(calm.stamp, "routed");
});

test("path word is cascade; named path seed holds the path", () => {
  assert.equal(PATH_WORD, "cascade");
  const result = analyze(seedCascade());
  assert.equal(result.verdict, "cascade");
  assert.equal(result.pathWord, "cascade");
  assert.equal(result.hold, false);
  assert.equal(
    classify({ seed: "cascade", preferSeed: true, inherited: true }),
    "cascade",
  );
  assert.equal(classify(seedModelAbsent()), "model-absent");
});

test("HOLD includes routed / hold", () => {
  assert.ok(HOLD.includes("routed"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: model-absent, cost-gate, self-invoke, policy, finder, verifier", () => {
  assert.equal(classify(seedModelAbsent()), "model-absent");
  assert.equal(classify(seedCostGateMissing()), "cost-gate-missing");
  assert.equal(classify(seedSelfInvoke()), "self-invoke");
  assert.equal(classify(seedForkPolicyBlind()), "fork-policy-blind");
  assert.equal(classify(seedFinderOnFable()), "finder-on-fable");
  assert.equal(classify(seedVerifierOnFable()), "verifier-on-fable");
  assert.equal(classify(seedAppanage()), "appanage");
});

test("fixture toggle flips routed vs inherited", () => {
  const idle = scoreGate(seedRouted());
  const seeded = scoreGate(readData("appanage.json"));
  assert.equal(idle.verdict, "routed");
  assert.equal(seeded.verdict, "inherited");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedRouted()), "routed");
  assert.equal(score(readData("appanage.json")), "inherited");
  const fixture = readData("appanage.json");
  assert.equal(fixture.agents, 10);
  assert.equal(fixture.childCount, 9);
  assert.equal(fixture.modelAbsent, true);
  assert.equal(fixture.parentFable, true);
  assert.equal(fixture.selfInvoke, true);
  assert.equal(fixture.report, false);
  assert.equal(fixture.cacheCreate, 1533907);
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("routed"));
  assert.ok(CHIPS.includes("inherited"));
  assert.ok(CHIPS.includes("appanage"));
  assert.ok(CHIPS.includes("cascade"));
  assert.ok(CHIPS.includes("chips"));
  assert.ok(CHIPS.includes("fingerprints"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("inherited"));
  assert.ok(ALARM.includes("cascade"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "chips", preferSeed: true }), "chips");
  assert.equal(classify({ seed: "fingerprints", preferSeed: true }), "fingerprints");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published appanage walk scores inherited after the idle hold", () => {
  const desk = scoreWalk({ rows: APPANAGE_WALK });
  assert.equal(desk.verdict, "inherited");
  assert.ok(desk.inheritedCount >= 1);
  const idle = desk.rows.find((row) => row.event === "cue-routed");
  assert.equal(idle.routed, true);
  assert.equal(idle.verdict, "routed");
  const crown = desk.rows.find((row) => row.event === "parent-fable");
  assert.equal(crown.parentFable, true);
  const invoke = desk.rows.find((row) => row.event === "self-invoke");
  assert.equal(invoke.selfInvoke, true);
  const seal = desk.rows.find((row) => row.event === "cost-gate-missing");
  assert.equal(seal.costGate, false);
  const absent = desk.rows.find((row) => row.event === "model-absent");
  assert.equal(absent.modelAbsent, true);
  const finder = desk.rows.find((row) => row.event === "finder-on-fable");
  assert.equal(finder.finderOnFable, true);
  const verifier = desk.rows.find((row) => row.event === "verifier-on-fable");
  assert.equal(verifier.verifierOnFable, true);
  const policy = desk.rows.find((row) => row.event === "fork-policy-blind");
  assert.equal(policy.forkPolicyBlind, true);
  const cut = desk.rows.find((row) => row.event === "inherited");
  assert.equal(cut.inherited, true);
  const path = desk.rows.find((row) => row.event === "cascade");
  assert.equal(path.verdict, "cascade");
});

test("APPANAGE_WALK constant matches the issue grant walk", () => {
  assert.equal(APPANAGE_WALK[0].event, "cue-routed");
  const absent = APPANAGE_WALK.find((row) => row.event === "model-absent");
  assert.equal(absent.childCount, 9);
  const cut = APPANAGE_WALK.find((row) => row.event === "inherited");
  assert.equal(cut.agents, 10);
  assert.equal(cut.cacheCreate, 1533907);
  const path = APPANAGE_WALK.find((row) => row.event === "cascade");
  assert.equal(path.inherited, true);
});

test("issue constants encode only #93307 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93307);
  assert.ok(ISSUE_URL.includes("93307"));
  assert.match(TITLE, /code-review skill/);
  assert.match(TITLE, /inherit the parent model/);
  assert.equal(STATE, "OPEN");
  assert.ok(LABELS.includes("bug"));
  assert.ok(LABELS.includes("has repro"));
  assert.ok(LABELS.includes("platform:macos"));
  assert.ok(LABELS.includes("area:cost"));
  assert.ok(LABELS.includes("area:agents"));
  assert.ok(LABELS.includes("area:skills"));
  assert.equal(AUTHOR, "elaye-canopy");
  assert.equal(FILED, "2026-09-10T09:21:02Z");
  assert.equal(CLAUDE_VERSION, "2.1.267");
  assert.match(OS, /darwin 24\.6\.0/);
  assert.equal(PARENT_MODEL, "claude-fable-5-1");
  assert.equal(SKILL, "code-review");
  assert.equal(SKILL_ARGS, "223 high");
  assert.equal(AGENT_COUNT, 10);
  assert.equal(CHILD_COUNT, 9);
  assert.equal(FINDER_ANGLES, 8);
  assert.equal(CACHE_CREATE, 1533907);
  assert.equal(CACHE_READ, 13651479);
  assert.equal(GRANT_STATIONS.length, 4);
  assert.ok(FINGERPRINT_LINES.includes("parent model: claude-fable-5-1"));
  assert.ok(FINGERPRINT_LINES.includes("fork + 9 children = 10 fable agents"));
  assert.match(PHRASE, /score appanage or admit routed/);
});

test("forbidden idle list includes recent catalog words", () => {
  const required = [
    "afloat",
    "washed",
    "bridge-loss",
    "pontoon",
    "concordant",
    "mismatched",
    "header-mismatch",
    "concordat",
    "reaped",
    "revenant",
    "wedged",
    "restored",
    "expanded",
    "laid",
    "released",
    "freehold",
    "trunked",
    "tokenized",
    "locked",
    "scratched",
    "unmasked",
    "replevin",
    "cognate",
    "lemures",
    "escheat",
    "mortmain",
    "strowger",
    "mondegreen",
    "derby",
    "vizard",
    "held",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("routed grant flips inherited back when children carry a model", () => {
  const tape = {
    routed: true,
    childrenRouted: true,
    costGate: true,
    policyReaches: true,
    inherited: false,
    modelAbsent: false,
    cue: "routed",
  };
  assert.equal(scoreGate(tape).verdict, "routed");
  tape.routed = false;
  tape.inherited = true;
  tape.modelAbsent = true;
  tape.parentFable = true;
  tape.cue = "inherited";
  assert.equal(scoreGate(tape).verdict, "inherited");
  tape.routed = true;
  tape.inherited = false;
  tape.modelAbsent = false;
  tape.parentFable = false;
  tape.childrenRouted = true;
  tape.costGate = true;
  tape.policyReaches = true;
  tape.cue = "routed";
  assert.equal(scoreGate(tape).verdict, "routed");
});

test("grant, cadency, and desk mark inherit after model-absent dispatch", () => {
  const idle = inspectGrant({
    childrenRouted: true,
    costGate: true,
    policyReaches: true,
  });
  assert.equal(idle.stamp, "routed");
  assert.equal(idle.inherited, false);
  const cut = inspectGrant({
    inherited: true,
    modelAbsent: true,
    parentFable: true,
  });
  assert.equal(cut.stamp, "inherited");
  const live = readCadency({
    finderOnFable: false,
    verifierOnFable: false,
  });
  assert.equal(live.stamp, "routed");
  const reject = readCadency({
    finderOnFable: true,
    verifierOnFable: true,
    parentFable: true,
    agents: 10,
  });
  assert.equal(reject.stamp, "inherited");
  assert.equal(reject.agents, 10);
  const desk = readGrant({
    inherited: true,
    modelAbsent: true,
    parentFable: true,
    finderOnFable: true,
  });
  assert.equal(desk.inherited, true);
  assert.equal(desk.cue, "inherited");
  const calm = readGrant({
    childrenRouted: true,
    costGate: true,
    policyReaches: true,
    inherited: false,
  });
  assert.equal(calm.inherited, false);
  assert.equal(calm.cue, "routed");
});

test("cousins are cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 3);
  assert.equal(COUSINS[0].issue, 73323);
  assert.equal(COUSINS[1].issue, 88003);
  assert.equal(COUSINS[2].issue, 90902);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("pontoon"));
  assert.ok(NOT_PRODUCTS.includes("concordat"));
  assert.ok(NOT_PRODUCTS.includes("revenant"));
  assert.ok(NOT_PRODUCTS.includes("replevin"));
  assert.ok(NOT_PRODUCTS.includes("cognate"));
  assert.ok(NOT_PRODUCTS.includes("lemures"));
  assert.ok(NOT_PRODUCTS.includes("escheat"));
  assert.ok(NOT_PRODUCTS.includes("mortmain"));
  assert.ok(NOT_PRODUCTS.includes("scion"));
  assert.ok(NOT_PRODUCTS.includes("vernier"));
  assert.equal(BACKUPS.length, 7);
  assert.equal(BACKUPS[0].issue, 93279);
  assert.equal(BACKUPS[4].issue, 93280);
  assert.equal(BACKUPS[6].issue, 93219);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/appanage.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(JSON.parse(idle.stdout).verdict, "routed");
  assert.equal(JSON.parse(seeded.stdout).verdict, "inherited");
});

test("handle exposes published hypothesis and #93307 headline", () => {
  const result = handle(readData("appanage.json"));
  assert.equal(result.published.issue, 93307);
  assert.equal(result.published.claudeVersion, "2.1.267");
  assert.equal(result.published.author, "elaye-canopy");
  assert.equal(result.published.agentCount, 10);
  assert.equal(result.published.parentModel, "claude-fable-5-1");
  assert.deepEqual(result.published.cousins, [73323, 88003, 90902]);
  assert.ok(result.published.backups.includes(93279));
  assert.ok(result.published.backups.includes(93280));
  assert.ok(result.published.backups.includes(93219));
  assert.match(result.published.hypothesis, /unset model on Agent calls/);
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(
    fingerprint(seedInherited()),
    /inherited\|model=absent\|gate=missing\|policy=blind\|parent=fable\|cue=inherited/,
  );
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(|https?:\/\/api\.|anthropic\.com\/v1/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is a royal-grant / heraldic inheritance desk, not a harbor pier", () => {
  const page = readPage();
  assert.match(page, /Playfair Display/);
  assert.match(page, /Source Sans 3/);
  assert.match(page, /IBM Plex Mono/);
  assert.match(page, /appanage|letters patent|heraldic|cadency|coronet/i);
  assert.match(page, /#1a1016|#d8b45c|#b31b2e|#efe4c8|#3d1a28|#6b2d4a/);
  assert.match(page, /routed/);
  assert.match(page, /inherited/);
  assert.match(page, /cascade/);
  assert.match(page, /score appanage or admit routed/i);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /19:50/);
  assert.match(page, /#269/);
  assert.match(page, /#93307/);
  assert.match(page, /elaye-canopy/);
  assert.match(page, /2\.1\.267/);
  assert.match(page, /claude-fable-5-1/);
  assert.match(page, /Open the grant/);
  assert.match(page, /Score appanage/);
  assert.match(page, /Walk the grant/);
  assert.match(page, /Inspect the cadency/);
  assert.doesNotMatch(page, /Karla/);
  assert.doesNotMatch(page, /Petrona/);
  assert.doesNotMatch(page, /Figtree/);
  assert.doesNotMatch(page, /Azeret Mono/);
  assert.doesNotMatch(page, /Vollkorn/);
  assert.doesNotMatch(page, /DM Sans/);
  assert.doesNotMatch(page, /Inconsolata/);
  assert.doesNotMatch(page, /Young Serif/);
  assert.doesNotMatch(page, /Mulish/);
  assert.doesNotMatch(page, /DM Mono/);
  assert.doesNotMatch(page, /Literata/);
  assert.doesNotMatch(page, /Sora/);
  assert.doesNotMatch(page, /Roboto Mono/);
  assert.doesNotMatch(page, /Fraunces/);
  assert.doesNotMatch(page, /Libre Baskerville/);
  assert.doesNotMatch(page, /Red Hat Text/);
  assert.doesNotMatch(page, /JetBrains Mono/);
  assert.doesNotMatch(page, /Cardo/);
  assert.doesNotMatch(page, /Fragment Mono/);
  assert.doesNotMatch(page, /Cinzel/);
  assert.doesNotMatch(page, /Syne/);
  assert.doesNotMatch(page, /Cormorant Garamond/);
  assert.doesNotMatch(page, /Outfit/);
  assert.doesNotMatch(page, /Space Mono/);
  assert.doesNotMatch(page, /#061018/);
  assert.doesNotMatch(page, /#2b1d12/);
  assert.doesNotMatch(page, /#b7c5d0/);
  assert.doesNotMatch(page, /#e59a18/);
  assert.doesNotMatch(page, /#c9a36a/);
  assert.doesNotMatch(page, /séance|seance|process-tomb|graveyard|charcoal bone|cold violet/i);
  assert.doesNotMatch(page, /night courtyard|black beans|bronze cymbals|chalk circles/i);
  assert.doesNotMatch(page, /muniment|dead-hand|charter roll/i);
  assert.doesNotMatch(page, /escheat chamber|escheator|inquisition|struck PID/i);
  assert.doesNotMatch(page, /switchboard|bakelite|trunk lamp|selector lever/i);
  assert.doesNotMatch(page, /ballad-sheet|lyric-mishearing|rose-madder/i);
  assert.doesNotMatch(page, /millimeter-slider|woodworking leftover/i);
  assert.doesNotMatch(page, /philology|ochre gloss|cognate desk/i);
  assert.doesNotMatch(page, /writ desk|bond parchment|court green|bronze seal/i);
  assert.doesNotMatch(page, /flintlock|flash-pan|priming-pan/i);
  assert.doesNotMatch(page, /water clock/);
  assert.doesNotMatch(page, /chancery|treaty-desk|protocol.desk|diplomatic|seal-wax/i);
  assert.doesNotMatch(page, /harbor pontoon|floating-bridge|timber deck|salt fog|navigation lights/i);
  assert.doesNotMatch(page, /\bafloat\b/);
  assert.doesNotMatch(page, /\bwashed\b/);
  assert.doesNotMatch(page, /\bpontoon\b/);
  assert.doesNotMatch(page, /\breaped\b/);
  assert.doesNotMatch(page, /\brevenant\b/);
  assert.doesNotMatch(page, /\breplevin\b/);
  assert.doesNotMatch(page, /\bcognate\b/);
  assert.doesNotMatch(page, /\blemures\b/);
  assert.doesNotMatch(page, /\bescheat\b/);
  assert.doesNotMatch(page, /\bmortmain\b/);
  assert.doesNotMatch(page, /\bstrowger\b/);
  assert.doesNotMatch(page, /\bmondegreen\b/);
  assert.doesNotMatch(page, /\bexpanded\b/);
  assert.doesNotMatch(page, /\brestored\b/);
  assert.doesNotMatch(page, /\bconcordant\b/);
  assert.doesNotMatch(page, /\bmismatched\b/);
  assert.doesNotMatch(page, /\bconcordat\b/);
  assert.doesNotMatch(page, /\bmoored\b/);
  assert.doesNotMatch(page, /\bscuttled\b/);
  assert.doesNotMatch(page, /\bheld\b/);
  assert.match(page, /NOT Pontoon/i);
  assert.match(page, /NOT Concordat/i);
  assert.match(page, /NOT Revenant/i);
  assert.match(page, /NOT Replevin/i);
  assert.match(page, /NOT Cognate/i);
  assert.match(page, /NOT Lemures/i);
  assert.match(page, /NOT Escheat/i);
  assert.match(page, /NOT Mortmain/i);
  assert.match(page, /NOT Strowger/i);
  assert.match(page, /NOT Mondegreen/i);
  assert.match(page, /NOT Buoy/i);
  assert.match(page, /NOT Vernier/i);
  assert.match(page, /NOT Scion/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Appanage/);
  assert.match(readme, /#93307/);
  assert.match(readme, /routed/);
  assert.match(readme, /inherited/);
  assert.match(readme, /cascade/);
  assert.match(readme, /Playfair Display/);
  assert.match(readme, /Source Sans 3/);
  assert.match(readme, /IBM Plex Mono/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /NOT Pontoon/i);
  assert.match(readme, /NOT Concordat/i);
  assert.match(readme, /NOT Revenant/i);
  assert.match(readme, /NOT Replevin/i);
  assert.match(readme, /NOT Cognate/i);
  assert.match(readme, /NOT Lemures/i);
  assert.match(readme, /NOT Escheat/i);
  assert.match(readme, /NOT Mortmain/i);
  assert.match(readme, /NOT Strowger/i);
  assert.match(readme, /NOT Mondegreen/i);
  assert.match(readme, /NOT Buoy/i);
  assert.match(readme, /NOT Vernier/i);
  assert.match(readme, /NOT Scion/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/appanage/);
  assert.match(readme, /node --test projects\/appanage\/appanage\.test\.mjs/);
  assert.match(readme, /NOT leftover woodworking/i);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /unset `model`/);
  assert.match(readme, /Skill tool has no model param/);
  assert.match(readme, /skill prompt wins/);
  assert.match(readme, /#93279/);
  assert.match(readme, /#73323/);
  assert.match(readme, /#88003/);
  assert.match(readme, /#90902/);
  assert.match(readme, /#93280/);
});

test("catalog #269 features Appanage only", () => {
  const catalog = readCatalog();
  assert.equal(catalog.products.length, 269);
  assert.equal(catalog.products[0].name, "Appanage");
  assert.equal(catalog.products[0].slug, "appanage");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/appanage/");
  assert.equal(catalog.products[0].day, "2026-09-10");
  assert.match(catalog.products[0].summary, /19:50/);
  assert.match(catalog.products[0].summary, /appanage/);
  assert.match(catalog.products[0].summary, /#93307/);
  assert.match(catalog.products[0].summary, /routed/);
  assert.match(catalog.products[0].summary, /inherited/);
  assert.match(catalog.products[0].summary, /cascade/);
  const pontoon = catalog.products.find((row) => row.slug === "pontoon");
  assert.ok(pontoon);
  assert.equal(pontoon.featured, false);
  const concordat = catalog.products.find((row) => row.slug === "concordat");
  assert.ok(concordat);
  assert.equal(concordat.featured, false);
  const revenant = catalog.products.find((row) => row.slug === "revenant");
  assert.ok(revenant);
  assert.equal(revenant.featured, false);
  const drift = catalog.products.find((row) => row.slug === "drift-radar");
  assert.ok(drift);
  assert.equal(drift.featured, false);
  const reorder = catalog.products.find((row) => row.slug === "reorder-radar");
  assert.ok(reorder);
  assert.equal(reorder.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "appanage").length, 1);
  assert.ok(!catalog.products.some((row) => String(row.summary || "").includes("93307") && row.slug !== "appanage"));
});

test("vercel rewrites appanage to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/appanage");
  assert.equal(vercel.rewrites[0].destination, "/projects/appanage");
  assert.equal(vercel.rewrites[1].source, "/appanage/");
  assert.equal(vercel.rewrites[1].destination, "/projects/appanage");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /https?:\/\/api\.anthropic/);
  assert.doesNotMatch(source, /\bcurl\b/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
