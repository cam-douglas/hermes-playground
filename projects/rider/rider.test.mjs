import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  ATTACHMENT_TYPE,
  BACKUPS,
  BOOTH_STATIONS,
  CHIPS,
  CODE_VERSION,
  CORRECTION_COUNT,
  COUSINS,
  DIRECTIVE,
  DISTRIBUTION,
  DOCKET_PLAQUES,
  EXPECTED,
  FEATURED_ISSUE,
  FINGERPRINT_LINES,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  HOLD,
  IDLE_WORD,
  INJECTION_COUNT,
  ISSUE_URL,
  LABELS,
  MODEL_NAME,
  NARRATION_PREFIX,
  NOT_PRODUCTS,
  OS_NAME,
  PATH_WORD,
  PHRASE,
  PLATFORM,
  POSITIVE_CONTROL_WALK,
  PRODUCT_WORD,
  REPRODUCTION_COUNT,
  RIDER_WALK,
  RULED_OUT,
  SAMPLE_BLOTTER,
  SAMPLE_CHANNEL,
  SAMPLE_HOUSE_ORDER,
  SAMPLE_STAPLE,
  SAMPLE_WAX,
  SEEDED_WORD,
  SESSION_KIND,
  STATE,
  TITLE,
  VERDICTS,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  inspectBlotter,
  inspectChannel,
  inspectHouseOrder,
  inspectStaple,
  inspectWaxWell,
  readBooth,
  score,
  scoreGate,
  scoreWalk,
  seedAttachmentRider,
  seedCorrection,
  seedHold,
  seedInjection,
  seedNoOptOut,
  seedPayloadOnly,
  seedPlain,
  seedPlanningNarration,
  seedRidden,
  seedRider,
  seedStaple,
  seedTrustBoundary,
} from "./rider.mjs";

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

function readHubCatalog() {
  return JSON.parse(
    readFileSync(fileURLToPath(new URL("../../hub/catalog.json", import.meta.url)), "utf8"),
  );
}

function readVercel() {
  return JSON.parse(
    readFileSync(fileURLToPath(new URL("../../vercel.json", import.meta.url)), "utf8"),
  );
}

function modelPath() {
  return fileURLToPath(new URL("./rider.mjs", import.meta.url));
}

test("idle plain is a hold; tool results carry only their payload", () => {
  const result = analyze(seedPlain());
  assert.equal(result.verdict, "plain");
  assert.equal(result.idleWord, "plain");
  assert.equal(IDLE_WORD, "plain");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.plain, true);
  assert.equal(result.phrase, "admit plain");
  assert.equal(result.ridden, false);
  assert.equal(result.attachmentRider, false);
  assert.equal(result.payloadOnly, true);
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify plain", () => {
  assert.equal(classify(emptyTicket()), "plain");
  assert.equal(classify(""), "plain");
  assert.equal(classify(null), "plain");
  assert.equal(decide({}), "plain");
});

test("#93683 seeded path scores rider when the docket is ridden", () => {
  const result = analyze(seedRidden());
  assert.equal(result.verdict, "rider");
  assert.equal(result.seededWord, "ridden");
  assert.equal(SEEDED_WORD, "ridden");
  assert.equal(PRODUCT_WORD, "rider");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.ridden, true);
  assert.equal(result.phrase, "score rider");
  assert.equal(result.staple, true);
  assert.equal(result.injection, true);
  assert.equal(result.correction, true);
  assert.equal(result.attachmentRider, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("staple plus injection is the #93683 rider", () => {
  const blotter = inspectBlotter({ ridden: true, staple: true });
  assert.equal(blotter.stamp, "ridden");
  assert.equal(blotter.ridden, true);
  const scored = scoreGate({
    ridden: true,
    staple: true,
    injection: true,
    correction: true,
    noOptOut: true,
    planningNarration: true,
    trustBoundary: true,
    attachmentRider: true,
    cue: "ridden",
    blotter: SAMPLE_BLOTTER,
    houseOrder: SAMPLE_HOUSE_ORDER,
  });
  assert.equal(scored.verdict, "rider");
  assert.equal(scored.attachmentRider, true);
  const open = inspectBlotter({ plain: true, payloadOnly: true });
  assert.equal(open.stamp, "payload");
});

test("path word is attachment-rider; named path seed holds the path", () => {
  assert.equal(PATH_WORD, "attachment-rider");
  const result = analyze(seedAttachmentRider());
  assert.equal(result.verdict, "attachment-rider");
  assert.equal(result.pathWord, "attachment-rider");
  assert.equal(result.hold, false);
  assert.equal(
    classify({ seed: "attachment-rider", preferSeed: true, ridden: true }),
    "attachment-rider",
  );
  assert.equal(classify(seedStaple()), "staple");
});

test("HOLD includes plain / hold", () => {
  assert.ok(HOLD.includes("plain"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: staple, injection, correction, no-opt-out", () => {
  assert.equal(classify(seedStaple()), "staple");
  assert.equal(classify(seedInjection()), "injection");
  assert.equal(classify(seedCorrection()), "correction");
  assert.equal(classify(seedNoOptOut()), "no-opt-out");
  assert.equal(classify(seedPlanningNarration()), "planning-narration");
  assert.equal(classify(seedTrustBoundary()), "trust-boundary");
  assert.equal(classify(seedPayloadOnly()), "payload-only");
  assert.equal(classify(seedRider()), "rider");
});

test("booth fixtures flip plain vs ridden vs attachment-rider vs rider", () => {
  const idle = scoreGate(seedPlain());
  const seeded = scoreGate(seedRidden());
  const plain = readData("plain.json");
  const ridden = readData("ridden.json");
  const path = readData("attachment-rider.json");
  const product = readData("rider.json");
  const staple = readData("staple.json");
  const injection = readData("injection.json");
  const correction = readData("correction.json");
  const holdFix = readData("hold.json");
  assert.equal(idle.verdict, "plain");
  assert.equal(seeded.verdict, "rider");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedPlain()), "plain");
  assert.equal(score(seedRidden()), "rider");
  assert.equal(plain.payloadOnly, true);
  assert.equal(plain.plain, true);
  assert.equal(scoreGate(plain).verdict, "plain");
  assert.equal(ridden.staple, true);
  assert.equal(ridden.injection, true);
  assert.equal(ridden.correction, true);
  assert.equal(classify(ridden), "ridden");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /instruction|correct/i);
  assert.match(path.paths[1].result, /CLAUDE\.md|settings|timestamp/i);
  assert.equal(classify(path), "attachment-rider");
  assert.equal(classify(product), "rider");
  assert.equal(product.hubCount, "RIDER");
  assert.equal(ridden.issue, 93683);
  assert.equal(ridden.ridden, true);
  assert.equal(classify(staple), "staple");
  assert.equal(classify(injection), "injection");
  assert.equal(classify(correction), "correction");
  assert.equal(classify(holdFix), "hold");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("plain"));
  assert.ok(CHIPS.includes("ridden"));
  assert.ok(CHIPS.includes("rider"));
  assert.ok(CHIPS.includes("attachment-rider"));
  assert.ok(CHIPS.includes("staple"));
  assert.ok(CHIPS.includes("chips"));
  assert.ok(CHIPS.includes("fingerprints"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("ridden"));
  assert.ok(ALARM.includes("attachment-rider"));
  assert.ok(ALARM.includes("staple"));
  assert.ok(ALARM.includes("rider"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "chips", preferSeed: true }), "chips");
  assert.equal(classify({ seed: "fingerprints", preferSeed: true }), "fingerprints");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published rider walk scores rider after the idle hold", () => {
  const booth = scoreWalk({ rows: RIDER_WALK });
  assert.equal(booth.verdict, "rider");
  assert.ok(booth.riddenCount >= 1);
  const idle = booth.rows.find((row) => row.event === "cue-plain");
  assert.equal(idle.plain, true);
  assert.equal(idle.verdict, "plain");
  const staple = booth.rows.find((row) => row.event === "staple");
  assert.equal(staple.staple, true);
  const path = booth.rows.find((row) => row.event === "attachment-rider");
  assert.equal(path.verdict, "attachment-rider");
});

test("RIDER_WALK constant matches the issue attachment walk", () => {
  assert.equal(RIDER_WALK[0].event, "cue-plain");
  const staple = RIDER_WALK.find((row) => row.event === "staple");
  assert.equal(staple.staple, true);
  const path = RIDER_WALK.find((row) => row.event === "attachment-rider");
  assert.equal(path.ridden, true);
  const scoreRow = RIDER_WALK.find((row) => row.event === "rider");
  assert.equal(scoreRow.ridden, true);
});

test("positive control payload-only stays plain", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "plain");
  const ok = walk.rows.find((row) => row.event === "payload-only");
  assert.equal(ok.verdict, "plain");
  const hold = walk.rows.find((row) => row.event === "cue-plain");
  assert.equal(hold.plain, true);
  assert.equal(hold.verdict, "plain");
});

test("issue constants encode only #93683 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93683);
  assert.ok(ISSUE_URL.includes("93683"));
  assert.match(TITLE, /tool result/i);
  assert.match(TITLE, /opt-out/i);
  assert.match(TITLE, /user instruction/i);
  assert.equal(STATE, "OPEN");
  assert.ok(LABELS.includes("bug"));
  assert.ok(LABELS.includes("has repro"));
  assert.ok(LABELS.includes("platform:macos"));
  assert.ok(LABELS.includes("area:core"));
  assert.equal(PLATFORM, "macos");
  assert.equal(CODE_VERSION, "2.1.268");
  assert.equal(OS_NAME, "macOS darwin 25.6.0");
  assert.equal(MODEL_NAME, "Opus 4.5 (1M)");
  assert.equal(INJECTION_COUNT, 195);
  assert.equal(REPRODUCTION_COUNT, 138);
  assert.equal(CORRECTION_COUNT, 5);
  assert.equal(ATTACHMENT_TYPE, "attachment");
  assert.match(DIRECTIVE, /First privately list what you need next/);
  assert.match(NARRATION_PREFIX, /Privately, what I need next/);
  assert.equal(DOCKET_PLAQUES.length, 4);
  assert.ok(RULED_OUT.some((row) => /CLAUDE\.md/.test(row)));
  assert.ok(EXPECTED.some((row) => /CLAUDE\.md|settings|system channel|precedence/i.test(row)));
  assert.match(DISTRIBUTION, /195/);
  assert.match(SESSION_KIND, /2\.1\.268|195/);
  assert.equal(BOOTH_STATIONS.length, 5);
  assert.ok(FINGERPRINT_LINES.includes("attachment-rider"));
  assert.ok(FINGERPRINT_LINES.includes("ridden"));
  assert.match(PHRASE, /Score rider or admit plain/);
  assert.equal(SAMPLE_BLOTTER.ridden, true);
  assert.equal(SAMPLE_HOUSE_ORDER.outranked, true);
  assert.equal(SAMPLE_STAPLE.on, true);
  assert.equal(SAMPLE_WAX.empty, true);
  assert.equal(SAMPLE_CHANNEL.toolResult, true);
});

test("has-repro fingerprints encode the published ridden clerk desk", () => {
  const result = handle(seedRidden());
  assert.equal(result.published.platform, "macos");
  assert.match(result.published.sessionKind, /195/);
  assert.match(result.published.directive, /First privately list/);
  assert.match(
    fingerprint(seedRidden()),
    /rider\|blotter=ridden\|order=outranked\|staple=on\|wax=absent\|channel=tool-result\|path=attachment-rider\|cue=attachment-rider/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes recent catalog words including Followspot and Calends", () => {
  const required = [
    "lit",
    "dark",
    "spawn-mcp-focus",
    "followspot",
    "due",
    "misfired",
    "catchup-dow",
    "calends",
    "flowing",
    "dammed",
    "egress-allowlist",
    "weir",
    "underway",
    "becalmed",
    "cron-websearch",
    "irons",
    "seated",
    "raced",
    "ptmx-race",
    "cathead",
    "tip",
    "stale",
    "prewarm-latch",
    "anachronism",
    "stamped",
    "emptied",
    "empty-expand",
    "nullarbor",
    "standing",
    "hoisted",
    "petard",
    "wrapper-argv",
    "raised",
    "furled",
    "aposiopesis",
    "git-cwd-mute",
    "seised",
    "disseised",
    "disseisin",
    "home-evaporated",
    "ordered",
    "redelivered",
    "analepsis",
    "marker-misorder",
    "viewed",
    "withheld",
    "monstrance",
    "phantom-deny",
    "closed",
    "lingering",
    "unrung",
    "compline",
    "sealed",
    "blanked",
    "cipherlock",
    "concurrent-write",
    "voiced",
    "muted",
    "sourdine",
    "mid-narration",
    "counterfoil",
    "cachet",
    "mondegreen",
    "seizing",
    "hangfire",
    "flashpan",
    "frizzen",
    "primed",
    "flashed",
    "mirage",
    "lodged",
    "kindled",
    "flushed",
    "solitary",
    "hit",
    "dropped",
    "painted",
    "lagged",
    "twinlinked",
    "flattened",
    "held",
    "steered",
    "greenroomed",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("plain booth flips ridden back when the payload is alone", () => {
  const tape = {
    plain: true,
    ridden: false,
    payloadOnly: true,
    cue: "plain",
  };
  assert.equal(scoreGate(tape).verdict, "plain");
  tape.plain = false;
  tape.ridden = true;
  tape.staple = true;
  tape.injection = true;
  tape.correction = true;
  tape.cue = "ridden";
  assert.equal(scoreGate(tape).verdict, "rider");
  tape.plain = true;
  tape.ridden = false;
  tape.staple = false;
  tape.injection = false;
  tape.correction = false;
  tape.cue = "plain";
  assert.equal(scoreGate(tape).verdict, "plain");
});

test("blotter, house order, staple, wax, channel, and readBooth mark the ridden desk", () => {
  const idle = inspectBlotter({
    plain: true,
    payloadOnly: true,
    blotter: { payloadOnly: true, ridden: false },
  });
  assert.equal(idle.stamp, "payload");
  const order = inspectHouseOrder({ ridden: true, houseOrder: SAMPLE_HOUSE_ORDER });
  assert.equal(order.stamp, "outranked");
  assert.equal(order.outranked, true);
  const staple = inspectStaple({
    injection: true,
    stapleClip: SAMPLE_STAPLE,
  });
  assert.equal(staple.stamp, "on");
  const wax = inspectWaxWell({ ridden: true, attachmentRider: true });
  assert.equal(wax.stamp, "absent");
  const channel = inspectChannel({ ridden: true, trustBoundary: true });
  assert.equal(channel.stamp, "tool-result");
  const booth = readBooth({
    ridden: true,
    staple: true,
    injection: true,
    blotter: SAMPLE_BLOTTER,
    houseOrder: SAMPLE_HOUSE_ORDER,
  });
  assert.equal(booth.ridden, true);
  assert.equal(booth.mark, "ridden");
  const open = readBooth({
    plain: true,
    ridden: false,
    payloadOnly: true,
  });
  assert.equal(open.ridden, false);
  assert.equal(open.mark, "plain");
});

test("cousins are cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 3);
  assert.equal(COUSINS[0].issue, 84070);
  assert.equal(COUSINS[1].issue, 64539);
  assert.equal(COUSINS[2].issue, 93673);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.match(COUSINS[0].why, /84070|system prompt|rebuild/i);
  assert.match(COUSINS[1].why, /64539|untagged|channel/i);
  assert.match(COUSINS[2].why, /93673|btw|advisor/i);
  assert.ok(NOT_PRODUCTS.includes("followspot"));
  assert.ok(NOT_PRODUCTS.includes("calends"));
  assert.ok(NOT_PRODUCTS.includes("weir"));
  assert.ok(NOT_PRODUCTS.includes("irons"));
  assert.ok(NOT_PRODUCTS.includes("cathead"));
  assert.ok(NOT_PRODUCTS.includes("anachronism"));
  assert.ok(NOT_PRODUCTS.includes("nullarbor"));
  assert.ok(NOT_PRODUCTS.includes("petard"));
  assert.ok(NOT_PRODUCTS.includes("greenroom"));
  assert.ok(NOT_PRODUCTS.includes("attainder"));
  assert.equal(BACKUPS.length, 7);
  assert.equal(BACKUPS[0].issue, 93703);
  assert.equal(BACKUPS[1].issue, 93672);
  assert.equal(BACKUPS[2].issue, 93652);
  assert.equal(BACKUPS[3].issue, 93680);
  assert.equal(BACKUPS[4].issue, 93618);
  assert.equal(BACKUPS[5].issue, 93694);
  assert.equal(BACKUPS[6].issue, 93722);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.match(BACKUPS[0].title, /Monadnock/i);
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/ridden.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(JSON.parse(idle.stdout).verdict, "plain");
  assert.equal(JSON.parse(seeded.stdout).verdict, "ridden");
});

test("handle exposes published hypothesis and #93683 headline", () => {
  const result = handle(seedRidden());
  assert.equal(result.published.issue, 93683);
  assert.equal(result.published.platform, "macos");
  assert.deepEqual(result.published.cousins, [84070, 64539, 93673]);
  assert.ok(result.published.backups.includes(93703));
  assert.ok(result.published.backups.includes(93722));
  assert.match(result.published.hypothesis, /type=attachment|harness|opt-out|correction/i);
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#93683/);
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is a parliamentary clerk desk / bill-rider booth, not followspot or calends", () => {
  const page = readPage();
  assert.match(page, /Libre Baskerville|Libre\+Baskerville/);
  assert.match(page, /Source Sans 3|Source\+Sans\+3/);
  assert.match(page, /IBM Plex Mono|IBM\+Plex\+Mono/);
  assert.match(page, /clerk desk|bill-rider|parliamentary|staple|docket/i);
  assert.match(page, /#F4EFE4|#1A1F2B|#9B2D2D|#B08D57|#5C6570|#2E3644/i);
  assert.match(page, /\bplain\b/);
  assert.match(page, /\bridden\b/);
  assert.match(page, /attachment-rider/);
  assert.match(page, /Score rider or admit plain/i);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /07:50/);
  assert.match(page, /#301/);
  assert.match(page, /#93683/);
  assert.match(page, /Unstaple the rider/);
  assert.match(page, /Score rider/);
  assert.match(page, /Walk the bill/);
  assert.match(page, /Compare plain \/ ridden/);
  assert.match(page, /Pin idle plain/);
  assert.match(page, /Pin seeded ridden/);
  assert.match(page, /Pin attachment-rider/);
  assert.match(page, /Hold the plain/);
  assert.doesNotMatch(page, /Oswald/);
  assert.doesNotMatch(page, /Karla/);
  assert.doesNotMatch(page, /Space Mono|Space\+Mono/);
  assert.doesNotMatch(page, /Cinzel/);
  assert.doesNotMatch(page, /Figtree/);
  assert.doesNotMatch(page, /Fira Code|Fira\+Code/);
  assert.doesNotMatch(page, /Fraunces/);
  assert.doesNotMatch(page, /Manrope/);
  assert.doesNotMatch(page, /Source Code Pro|Source\+Code\+Pro/);
  assert.doesNotMatch(page, /Cardo/);
  assert.doesNotMatch(page, /Literata/);
  assert.doesNotMatch(page, /Sora/);
  assert.doesNotMatch(page, /Red Hat Mono|Red\+Hat\+Mono/);
  assert.doesNotMatch(page, /DM Sans|DM\+Sans/);
  assert.doesNotMatch(page, /#0D0B10/);
  assert.doesNotMatch(page, /#F5C542/);
  assert.doesNotMatch(page, /#8B1E3F/);
  assert.doesNotMatch(page, /#3D5A80/);
  assert.doesNotMatch(page, /#6B4C9A/);
  assert.doesNotMatch(page, /prop belt|operator iris|prompt book/i);
  assert.doesNotMatch(page, /mill weir|millrace|rust gates|MCP millstone|miller/i);
  assert.doesNotMatch(page, /in irons|head-to-wind|WebSearch kite|wind gauge/i);
  assert.doesNotMatch(page, /oak cathead|anchor-timber|slot-vector|placeholder cat|respawn lever|ENXIO/i);
  assert.doesNotMatch(page, /continuity slate|darkroom chronometer|sprocket rail|pre-warm take/i);
  assert.doesNotMatch(page, /saltbush|ticket booth|Eyre mile|brass stamp|empty-bearer/i);
  assert.doesNotMatch(page, /siege petard|powder-charge|sapper trench|fuse rail|argv mirror/i);
  assert.doesNotMatch(page, /fasti|nundinal|kalends|acta diurna|catch-up hand/i);
  assert.doesNotMatch(page, /offstage waiting|Queue for later|chat:queueSubmit/i);
  assert.doesNotMatch(page, /\blit\b/);
  assert.doesNotMatch(page, /\bdark\b/);
  assert.doesNotMatch(page, /spawn-mcp-focus/);
  assert.doesNotMatch(page, /\bdue\b/);
  assert.doesNotMatch(page, /\bmisfired\b/);
  assert.doesNotMatch(page, /catchup-dow/);
  assert.doesNotMatch(page, /\bflowing\b/);
  assert.doesNotMatch(page, /\bdammed\b/);
  assert.doesNotMatch(page, /egress-allowlist/);
  assert.doesNotMatch(page, /\bunderway\b/);
  assert.doesNotMatch(page, /\bbecalmed\b/);
  assert.doesNotMatch(page, /\bseated\b/);
  assert.doesNotMatch(page, /\braced\b/);
  assert.doesNotMatch(page, /\bheld\b/);
  assert.doesNotMatch(page, /\bsteered\b/);
  assert.doesNotMatch(page, /greenroomed/);
  assert.match(page, /NOT Followspot/i);
  assert.match(page, /NOT Calends/i);
  assert.match(page, /NOT Weir/i);
  assert.match(page, /NOT Irons/i);
  assert.match(page, /NOT Cathead/i);
  assert.match(page, /NOT Anachronism/i);
  assert.match(page, /NOT Nullarbor/i);
  assert.match(page, /NOT Petard/i);
  assert.match(page, /NOT Greenroom/i);
  assert.match(page, /NOT Attainder/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Rider/);
  assert.match(readme, /#93683/);
  assert.match(readme, /\bplain\b/);
  assert.match(readme, /\bridden\b/);
  assert.match(readme, /attachment-rider/);
  assert.match(readme, /Libre Baskerville/);
  assert.match(readme, /Source Sans 3/);
  assert.match(readme, /IBM Plex Mono/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /NOT Followspot/i);
  assert.match(readme, /NOT Calends/i);
  assert.match(readme, /NOT Weir/i);
  assert.match(readme, /NOT Irons/i);
  assert.match(readme, /NOT Cathead/i);
  assert.match(readme, /NOT Anachronism/i);
  assert.match(readme, /NOT Nullarbor/i);
  assert.match(readme, /NOT Petard/i);
  assert.match(readme, /NOT Greenroom/i);
  assert.match(readme, /NOT Attainder/i);
  assert.match(readme, /#84070/);
  assert.match(readme, /#64539/);
  assert.match(readme, /#93673/);
  assert.match(readme, /type=attachment|195|opt-out/);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/rider/);
  assert.match(readme, /node --test projects\/rider\/rider\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /clerk desk|bill-rider|staple|docket/i);
  assert.match(readme, /Score rider or admit plain/);
  assert.match(readme, /#93703|#93672|#93652|#93680|#93618|#93694|#93722/);
});

test("catalog features Rider only; Followspot unfeatured", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 301);
  assert.equal(hub.products.length, 301);
  assert.equal(catalog.products[0].name, "Rider");
  assert.equal(catalog.products[0].slug, "rider");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/rider/");
  assert.equal(catalog.products[0].day, "2026-09-12");
  assert.match(catalog.products[0].summary, /07:50/);
  assert.match(catalog.products[0].summary, /rider/);
  assert.match(catalog.products[0].summary, /#93683/);
  assert.match(catalog.products[0].summary, /\bplain\b/);
  assert.match(catalog.products[0].summary, /\bridden\b/);
  assert.match(catalog.products[0].summary, /attachment-rider/);
  assert.equal(hub.products[0].slug, "rider");
  assert.equal(hub.products[0].featured, true);
  const followspot = catalog.products.find((row) => row.slug === "followspot");
  assert.ok(followspot);
  assert.equal(followspot.featured, false);
  const calends = catalog.products.find((row) => row.slug === "calends");
  assert.ok(calends);
  assert.equal(calends.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "rider").length, 1);
  assert.ok(!catalog.products.some((row) => String(row.summary || "").includes("93683") && row.slug !== "rider"));
});

test("vercel rewrites rider to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/rider");
  assert.equal(vercel.rewrites[0].destination, "/projects/rider");
  assert.equal(vercel.rewrites[1].source, "/rider/");
  assert.equal(vercel.rewrites[1].destination, "/projects/rider");
  assert.equal(vercel.rewrites[2].source, "/rider/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/rider/:path*");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /\bcurl\b/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
