import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  BACKUPS,
  BOOTH_STATIONS,
  CHIP_MCP_COUNTS,
  CHIP_PLAQUES,
  CHIPS,
  CODE_VERSION,
  CONFIG_PATH,
  COUSINS,
  DESKTOP_VERSION,
  DISTRIBUTION,
  FEATURED_ISSUE,
  FINGERPRINT_LINES,
  FOLLOWSPOT_WALK,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  HOLD,
  IDLE_WORD,
  INTERNAL_SERVERS,
  ISSUE_URL,
  LABELS,
  LOCAL_SERVER_COUNT,
  NORMAL_MCP_MAX,
  NORMAL_MCP_MIN,
  NOT_PRODUCTS,
  OS_NAME,
  PATH_WORD,
  PHRASE,
  PLATFORM,
  POSITIVE_CONTROL_WALK,
  PRODUCT_WORD,
  SAMPLE_BEAM,
  SAMPLE_CUE,
  SAMPLE_HOUSE,
  SAMPLE_IRIS,
  SAMPLE_PROPS,
  SEEDED_WORD,
  SESSION_KIND,
  STATE,
  TITLE,
  TOOL_COUNT_AFTER_ATTACH,
  TOTAL_AFTER_RECONCILE,
  VERDICTS,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  inspectBeam,
  inspectCue,
  inspectHouse,
  inspectIris,
  inspectProps,
  readBooth,
  score,
  scoreGate,
  scoreWalk,
  seedChipSpawn,
  seedDark,
  seedFocusAttach,
  seedFollowspot,
  seedHealthyServers,
  seedHold,
  seedInternalOnly,
  seedLit,
  seedMidTurnSteer,
  seedNextQueuedCue,
  seedSpawnMcpFocus,
  seedToolsearchEmpty,
} from "./followspot.mjs";

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
  return fileURLToPath(new URL("./followspot.mjs", import.meta.url));
}

test("idle lit is a hold; user MCP belt armed at spawn", () => {
  const result = analyze(seedLit());
  assert.equal(result.verdict, "lit");
  assert.equal(result.idleWord, "lit");
  assert.equal(IDLE_WORD, "lit");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.lit, true);
  assert.equal(result.phrase, "admit lit");
  assert.equal(result.dark, false);
  assert.equal(result.spawnMcpFocus, false);
  assert.equal(result.healthyServers, true);
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify lit", () => {
  assert.equal(classify(emptyTicket()), "lit");
  assert.equal(classify(""), "lit");
  assert.equal(classify(null), "lit");
  assert.equal(decide({}), "lit");
});

test("#93714 seeded path scores followspot when the beam stays dark", () => {
  const result = analyze(seedDark());
  assert.equal(result.verdict, "followspot");
  assert.equal(result.seededWord, "dark");
  assert.equal(SEEDED_WORD, "dark");
  assert.equal(PRODUCT_WORD, "followspot");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.dark, true);
  assert.equal(result.phrase, "score followspot");
  assert.equal(result.chipSpawn, true);
  assert.equal(result.internalOnly, true);
  assert.equal(result.focusAttach, true);
  assert.equal(result.spawnMcpFocus, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("chip-spawn plus internal-only is the #93714 followspot", () => {
  const beam = inspectBeam({ dark: true, chipSpawn: true });
  assert.equal(beam.stamp, "dark");
  assert.equal(beam.dark, true);
  const scored = scoreGate({
    dark: true,
    chipSpawn: true,
    internalOnly: true,
    focusAttach: true,
    midTurnSteer: true,
    nextQueuedCue: true,
    toolsearchEmpty: true,
    spawnMcpFocus: true,
    cue: "dark",
    beam: SAMPLE_BEAM,
    house: SAMPLE_HOUSE,
  });
  assert.equal(scored.verdict, "followspot");
  assert.equal(scored.spawnMcpFocus, true);
  const open = inspectBeam({ lit: true, healthyServers: true });
  assert.equal(open.stamp, "lit");
});

test("path word is spawn-mcp-focus; named path seed holds the path", () => {
  assert.equal(PATH_WORD, "spawn-mcp-focus");
  const result = analyze(seedSpawnMcpFocus());
  assert.equal(result.verdict, "spawn-mcp-focus");
  assert.equal(result.pathWord, "spawn-mcp-focus");
  assert.equal(result.hold, false);
  assert.equal(
    classify({ seed: "spawn-mcp-focus", preferSeed: true, dark: true }),
    "spawn-mcp-focus",
  );
  assert.equal(classify(seedChipSpawn()), "chip-spawn");
});

test("HOLD includes lit / hold", () => {
  assert.ok(HOLD.includes("lit"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: chip-spawn, internal-only, focus-attach, mid-turn-steer", () => {
  assert.equal(classify(seedChipSpawn()), "chip-spawn");
  assert.equal(classify(seedInternalOnly()), "internal-only");
  assert.equal(classify(seedFocusAttach()), "focus-attach");
  assert.equal(classify(seedMidTurnSteer()), "mid-turn-steer");
  assert.equal(classify(seedNextQueuedCue()), "next-queued-cue");
  assert.equal(classify(seedToolsearchEmpty()), "toolsearch-empty");
  assert.equal(classify(seedHealthyServers()), "healthy-servers");
  assert.equal(classify(seedFollowspot()), "followspot");
});

test("booth fixtures flip lit vs dark vs spawn-mcp-focus vs followspot", () => {
  const idle = scoreGate(seedLit());
  const seeded = scoreGate(seedDark());
  const lit = readData("lit.json");
  const dark = readData("dark.json");
  const path = readData("spawn-mcp-focus.json");
  const product = readData("followspot.json");
  const chip = readData("chip-spawn.json");
  const internal = readData("internal-only.json");
  const focus = readData("focus-attach.json");
  const steer = readData("mid-turn-steer.json");
  const holdFix = readData("hold.json");
  assert.equal(idle.verdict, "lit");
  assert.equal(seeded.verdict, "followspot");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedLit()), "lit");
  assert.equal(score(seedDark()), "followspot");
  assert.equal(lit.healthyServers, true);
  assert.equal(lit.lit, true);
  assert.equal(scoreGate(lit).verdict, "lit");
  assert.equal(dark.chipSpawn, true);
  assert.equal(dark.internalOnly, true);
  assert.equal(dark.focusAttach, true);
  assert.equal(classify(dark), "dark");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /spawn_task|chip|claude_desktop_config/i);
  assert.match(path.paths[1].result, /focus|setFocusedSession|internal/i);
  assert.equal(classify(path), "spawn-mcp-focus");
  assert.equal(classify(product), "followspot");
  assert.equal(product.hubCount, "FOLLOWSPOT");
  assert.equal(dark.issue, 93714);
  assert.equal(dark.dark, true);
  assert.equal(classify(chip), "chip-spawn");
  assert.equal(classify(internal), "internal-only");
  assert.equal(classify(focus), "focus-attach");
  assert.equal(classify(steer), "mid-turn-steer");
  assert.equal(classify(holdFix), "hold");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("lit"));
  assert.ok(CHIPS.includes("dark"));
  assert.ok(CHIPS.includes("followspot"));
  assert.ok(CHIPS.includes("spawn-mcp-focus"));
  assert.ok(CHIPS.includes("chip-spawn"));
  assert.ok(CHIPS.includes("chips"));
  assert.ok(CHIPS.includes("fingerprints"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("dark"));
  assert.ok(ALARM.includes("spawn-mcp-focus"));
  assert.ok(ALARM.includes("chip-spawn"));
  assert.ok(ALARM.includes("followspot"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "chips", preferSeed: true }), "chips");
  assert.equal(classify({ seed: "fingerprints", preferSeed: true }), "fingerprints");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published followspot walk scores followspot after the idle hold", () => {
  const booth = scoreWalk({ rows: FOLLOWSPOT_WALK });
  assert.equal(booth.verdict, "followspot");
  assert.ok(booth.darkCount >= 1);
  const idle = booth.rows.find((row) => row.event === "cue-lit");
  assert.equal(idle.lit, true);
  assert.equal(idle.verdict, "lit");
  const chip = booth.rows.find((row) => row.event === "chip-spawn");
  assert.equal(chip.chipSpawn, true);
  const path = booth.rows.find((row) => row.event === "spawn-mcp-focus");
  assert.equal(path.verdict, "spawn-mcp-focus");
});

test("FOLLOWSPOT_WALK constant matches the issue chip-spawn walk", () => {
  assert.equal(FOLLOWSPOT_WALK[0].event, "cue-lit");
  const chip = FOLLOWSPOT_WALK.find((row) => row.event === "chip-spawn");
  assert.equal(chip.chipSpawn, true);
  const path = FOLLOWSPOT_WALK.find((row) => row.event === "spawn-mcp-focus");
  assert.equal(path.dark, true);
  const scoreRow = FOLLOWSPOT_WALK.find((row) => row.event === "followspot");
  assert.equal(scoreRow.dark, true);
});

test("positive control healthy-servers stays lit", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "lit");
  const ok = walk.rows.find((row) => row.event === "healthy-servers");
  assert.equal(ok.verdict, "lit");
  const hold = walk.rows.find((row) => row.event === "cue-lit");
  assert.equal(hold.lit, true);
  assert.equal(hold.verdict, "lit");
});

test("issue constants encode only #93714 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93714);
  assert.ok(ISSUE_URL.includes("93714"));
  assert.match(TITLE, /spawn_task/i);
  assert.match(TITLE, /claude_desktop_config/i);
  assert.match(TITLE, /next queued turn/i);
  assert.equal(STATE, "OPEN");
  assert.ok(LABELS.includes("bug"));
  assert.ok(LABELS.includes("has repro"));
  assert.ok(LABELS.includes("platform:linux"));
  assert.ok(LABELS.includes("area:mcp"));
  assert.ok(LABELS.includes("area:agents"));
  assert.ok(LABELS.includes("area:desktop"));
  assert.equal(PLATFORM, "Linux");
  assert.equal(DESKTOP_VERSION, "1.49585.0");
  assert.equal(CODE_VERSION, "2.1.260");
  assert.equal(OS_NAME, "Ubuntu");
  assert.equal(LOCAL_SERVER_COUNT, 7);
  assert.equal(NORMAL_MCP_MIN, 15);
  assert.equal(NORMAL_MCP_MAX, 16);
  assert.deepEqual([...CHIP_MCP_COUNTS], [9, 9, 8]);
  assert.ok(INTERNAL_SERVERS.includes("ccd_directory"));
  assert.ok(INTERNAL_SERVERS.includes("ccd_session_mgmt"));
  assert.ok(INTERNAL_SERVERS.includes("mcp-registry"));
  assert.ok(INTERNAL_SERVERS.includes("scheduled-tasks"));
  assert.equal(TOOL_COUNT_AFTER_ATTACH, 243);
  assert.equal(TOTAL_AFTER_RECONCILE, 15);
  assert.match(CONFIG_PATH, /claude_desktop_config\.json/);
  assert.equal(CHIP_PLAQUES.length, 4);
  assert.match(DISTRIBUTION, /mcp_count=8\/9/);
  assert.match(SESSION_KIND, /20:18:49|setFocusedSession/);
  assert.equal(BOOTH_STATIONS.length, 5);
  assert.ok(FINGERPRINT_LINES.includes("spawn-mcp-focus"));
  assert.ok(FINGERPRINT_LINES.includes("dark"));
  assert.match(PHRASE, /Score followspot or admit lit/);
  assert.equal(SAMPLE_BEAM.dark, true);
  assert.equal(SAMPLE_HOUSE.internalOnly, true);
  assert.equal(SAMPLE_IRIS.focusRequired, true);
  assert.equal(SAMPLE_CUE.midTurnSteer, true);
  assert.equal(SAMPLE_PROPS.late, true);
});

test("has-repro fingerprints encode the published chip-spawn dark house", () => {
  const result = handle(seedDark());
  assert.equal(result.published.platform, "Linux");
  assert.match(result.published.sessionKind, /20:18:49/);
  assert.match(result.published.configPath, /claude_desktop_config/);
  assert.match(
    fingerprint(seedDark()),
    /followspot\|beam=dark\|house=internal-only\|iris=focus-attach\|cue=queued-late\|props=late\|path=spawn-mcp-focus\|cue=spawn-mcp-focus/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes recent catalog words including Calends and Greenroom", () => {
  const required = [
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

test("lit booth flips dark back when the belt is armed at spawn", () => {
  const tape = {
    lit: true,
    dark: false,
    healthyServers: true,
    cue: "lit",
  };
  assert.equal(scoreGate(tape).verdict, "lit");
  tape.lit = false;
  tape.dark = true;
  tape.chipSpawn = true;
  tape.internalOnly = true;
  tape.focusAttach = true;
  tape.cue = "dark";
  assert.equal(scoreGate(tape).verdict, "followspot");
  tape.lit = true;
  tape.dark = false;
  tape.chipSpawn = false;
  tape.internalOnly = false;
  tape.focusAttach = false;
  tape.cue = "lit";
  assert.equal(scoreGate(tape).verdict, "lit");
});

test("beam, house, iris, cue, props, and readBooth mark the dark house", () => {
  const idle = inspectBeam({
    lit: true,
    healthyServers: true,
    beam: { armed: true, dark: false },
  });
  assert.equal(idle.stamp, "lit");
  const house = inspectHouse({ dark: true, house: SAMPLE_HOUSE });
  assert.equal(house.stamp, "internal-only");
  assert.equal(house.internalOnly, true);
  const iris = inspectIris({
    focusAttach: true,
    iris: SAMPLE_IRIS,
  });
  assert.equal(iris.stamp, "focus-attach");
  const cueBook = inspectCue({ dark: true, spawnMcpFocus: true });
  assert.equal(cueBook.stamp, "queued-late");
  const props = inspectProps({ dark: true, toolsearchEmpty: true });
  assert.equal(props.stamp, "late");
  const booth = readBooth({
    dark: true,
    chipSpawn: true,
    internalOnly: true,
    beam: SAMPLE_BEAM,
    house: SAMPLE_HOUSE,
  });
  assert.equal(booth.dark, true);
  assert.equal(booth.mark, "dark");
  const open = readBooth({
    lit: true,
    dark: false,
    healthyServers: true,
  });
  assert.equal(open.dark, false);
  assert.equal(open.mark, "lit");
});

test("cousins are cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 2);
  assert.equal(COUSINS[0].issue, 67432);
  assert.equal(COUSINS[1].issue, 90061);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.match(COUSINS[0].why, /67432|inactivity|rebuild/i);
  assert.match(COUSINS[1].why, /90061|connector|in-flight/i);
  assert.ok(NOT_PRODUCTS.includes("calends"));
  assert.ok(NOT_PRODUCTS.includes("weir"));
  assert.ok(NOT_PRODUCTS.includes("irons"));
  assert.ok(NOT_PRODUCTS.includes("cathead"));
  assert.ok(NOT_PRODUCTS.includes("anachronism"));
  assert.ok(NOT_PRODUCTS.includes("nullarbor"));
  assert.ok(NOT_PRODUCTS.includes("petard"));
  assert.ok(NOT_PRODUCTS.includes("greenroom"));
  assert.ok(NOT_PRODUCTS.includes("flashpan"));
  assert.equal(BACKUPS.length, 7);
  assert.equal(BACKUPS[0].issue, 93683);
  assert.equal(BACKUPS[1].issue, 93703);
  assert.equal(BACKUPS[2].issue, 93672);
  assert.equal(BACKUPS[3].issue, 93652);
  assert.equal(BACKUPS[4].issue, 93680);
  assert.equal(BACKUPS[5].issue, 93618);
  assert.equal(BACKUPS[6].issue, 93694);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.match(BACKUPS[0].title, /Rider|injection/i);
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/dark.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(JSON.parse(idle.stdout).verdict, "lit");
  assert.equal(JSON.parse(seeded.stdout).verdict, "dark");
});

test("handle exposes published hypothesis and #93714 headline", () => {
  const result = handle(seedDark());
  assert.equal(result.published.issue, 93714);
  assert.equal(result.published.platform, "Linux");
  assert.deepEqual(result.published.cousins, [67432, 90061]);
  assert.ok(result.published.backups.includes(93683));
  assert.ok(result.published.backups.includes(93694));
  assert.match(result.published.hypothesis, /setFocusedSession|deferred_tools_delta|chip-spawn/i);
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#93714/);
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is a theatrical followspot / stage booth, not calends or greenroom", () => {
  const page = readPage();
  assert.match(page, /Oswald/);
  assert.match(page, /Karla/);
  assert.match(page, /Space Mono|Space\+Mono/);
  assert.match(page, /followspot|stage booth|prop belt|operator iris|prompt book/i);
  assert.match(page, /#0D0B10|#F5C542|#8B1E3F|#3D5A80|#E8E4DC|#6B4C9A/i);
  assert.match(page, /\blit\b/);
  assert.match(page, /\bdark\b/);
  assert.match(page, /spawn-mcp-focus/);
  assert.match(page, /Score followspot or admit lit/i);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /06:50/);
  assert.match(page, /#300/);
  assert.match(page, /#93714/);
  assert.match(page, /Light the belt/);
  assert.match(page, /Score followspot/);
  assert.match(page, /Walk the cue/);
  assert.match(page, /Compare lit \/ dark/);
  assert.match(page, /Pin idle lit/);
  assert.match(page, /Pin seeded dark/);
  assert.match(page, /Pin spawn-mcp-focus/);
  assert.match(page, /Hold the lit/);
  assert.doesNotMatch(page, /Cinzel/);
  assert.doesNotMatch(page, /Figtree/);
  assert.doesNotMatch(page, /Fira Code|Fira\+Code/);
  assert.doesNotMatch(page, /Fraunces/);
  assert.doesNotMatch(page, /Manrope/);
  assert.doesNotMatch(page, /Source Code Pro|Source\+Code\+Pro/);
  assert.doesNotMatch(page, /Cardo/);
  assert.doesNotMatch(page, /IBM Plex Mono|IBM\+Plex\+Mono/);
  assert.doesNotMatch(page, /Literata/);
  assert.doesNotMatch(page, /Sora/);
  assert.doesNotMatch(page, /Red Hat Mono|Red\+Hat\+Mono/);
  assert.doesNotMatch(page, /DM Sans|DM\+Sans/);
  assert.doesNotMatch(page, /#F7F4EC/);
  assert.doesNotMatch(page, /#1C2430/);
  assert.doesNotMatch(page, /#7A2E2E/);
  assert.doesNotMatch(page, /#C6A15B/);
  assert.doesNotMatch(page, /mill weir|millrace|rust gates|MCP millstone|miller/i);
  assert.doesNotMatch(page, /in irons|head-to-wind|WebSearch kite|wind gauge/i);
  assert.doesNotMatch(page, /oak cathead|anchor-timber|slot-vector|placeholder cat|respawn lever|ENXIO/i);
  assert.doesNotMatch(page, /continuity slate|darkroom chronometer|sprocket rail|pre-warm take/i);
  assert.doesNotMatch(page, /saltbush|ticket booth|Eyre mile|brass stamp|empty-bearer/i);
  assert.doesNotMatch(page, /siege petard|powder-charge|sapper trench|fuse rail|argv mirror/i);
  assert.doesNotMatch(page, /fasti|nundinal|kalends|acta diurna|catch-up hand/i);
  assert.doesNotMatch(page, /offstage waiting|Queue for later|chat:queueSubmit/i);
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
  assert.match(page, /NOT Calends/i);
  assert.match(page, /NOT Weir/i);
  assert.match(page, /NOT Irons/i);
  assert.match(page, /NOT Cathead/i);
  assert.match(page, /NOT Anachronism/i);
  assert.match(page, /NOT Nullarbor/i);
  assert.match(page, /NOT Petard/i);
  assert.match(page, /NOT Greenroom/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Followspot/);
  assert.match(readme, /#93714/);
  assert.match(readme, /\blit\b/);
  assert.match(readme, /\bdark\b/);
  assert.match(readme, /spawn-mcp-focus/);
  assert.match(readme, /Oswald/);
  assert.match(readme, /Karla/);
  assert.match(readme, /Space Mono/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /NOT Calends/i);
  assert.match(readme, /NOT Weir/i);
  assert.match(readme, /NOT Irons/i);
  assert.match(readme, /NOT Cathead/i);
  assert.match(readme, /NOT Anachronism/i);
  assert.match(readme, /NOT Nullarbor/i);
  assert.match(readme, /NOT Petard/i);
  assert.match(readme, /NOT Greenroom/i);
  assert.match(readme, /#67432/);
  assert.match(readme, /#90061/);
  assert.match(readme, /spawn_task|mcp_count|setFocusedSession/);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/followspot/);
  assert.match(readme, /node --test projects\/followspot\/followspot\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /followspot|prop belt|operator iris|prompt book/i);
  assert.match(readme, /Score followspot or admit lit/);
  assert.match(readme, /#93683|#93703|#93672|#93652|#93680|#93618|#93694/);
});

test("catalog features Followspot only; Calends unfeatured", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 300);
  assert.equal(hub.products.length, 300);
  assert.equal(catalog.products[0].name, "Followspot");
  assert.equal(catalog.products[0].slug, "followspot");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/followspot/");
  assert.equal(catalog.products[0].day, "2026-09-12");
  assert.match(catalog.products[0].summary, /06:50/);
  assert.match(catalog.products[0].summary, /followspot/);
  assert.match(catalog.products[0].summary, /#93714/);
  assert.match(catalog.products[0].summary, /\blit\b/);
  assert.match(catalog.products[0].summary, /\bdark\b/);
  assert.match(catalog.products[0].summary, /spawn-mcp-focus/);
  assert.equal(hub.products[0].slug, "followspot");
  assert.equal(hub.products[0].featured, true);
  const calends = catalog.products.find((row) => row.slug === "calends");
  assert.ok(calends);
  assert.equal(calends.featured, false);
  const weir = catalog.products.find((row) => row.slug === "weir");
  assert.ok(weir);
  assert.equal(weir.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "followspot").length, 1);
  assert.ok(!catalog.products.some((row) => String(row.summary || "").includes("93714") && row.slug !== "followspot"));
});

test("vercel rewrites followspot to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/followspot");
  assert.equal(vercel.rewrites[0].destination, "/projects/followspot");
  assert.equal(vercel.rewrites[1].source, "/followspot/");
  assert.equal(vercel.rewrites[1].destination, "/projects/followspot");
  assert.equal(vercel.rewrites[2].source, "/followspot/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/followspot/:path*");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /\bcurl\b/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
