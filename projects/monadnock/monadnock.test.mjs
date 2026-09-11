import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  BACKUPS,
  BEHIND_COUNT,
  BOOTH_STATIONS,
  CHIPS,
  CLI_VERSION,
  COUSINS,
  DESKTOP_VERSION,
  DISTRIBUTION,
  EXPECTED,
  EXPECTED_LINE,
  FEATURED_ISSUE,
  FINGERPRINT_LINES,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  HOLD,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  LOCAL_MAIN_DATE,
  LOCAL_MAIN_SHA,
  LOCAL_MAIN_SHORT,
  MONADNOCK_WALK,
  NOT_PRODUCTS,
  ORIGIN_MAIN_SHORT,
  PATH_WORD,
  PHRASE,
  PLATFORM,
  POSITIVE_CONTROL_WALK,
  PRODUCT_WORD,
  REFLOG_CLI,
  REFLOG_DESKTOP,
  REFLOG_SUPER,
  RULED_OUT,
  SAMPLE_CAIRN,
  SAMPLE_MASSIF,
  SAMPLE_PEAK,
  SAMPLE_PLATE,
  SAMPLE_SILL,
  SEEDED_WORD,
  SESSION_KIND,
  STATE,
  SURVEY_PLAQUES,
  TITLE,
  VERDICTS,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  inspectCairn,
  inspectFetchSill,
  inspectNestedMassif,
  inspectReflogPlate,
  inspectResidualPeak,
  readBooth,
  score,
  scoreGate,
  scoreWalk,
  seedBehind204,
  seedFetchFirst,
  seedFresh,
  seedHold,
  seedLocalMain,
  seedMonadnock,
  seedNestedRepo,
  seedOriginMain,
  seedRawSha,
  seedRefName,
  seedResidual,
  seedSubmoduleBase,
  seedSuperprojectOk,
} from "./monadnock.mjs";

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
  return fileURLToPath(new URL("./monadnock.mjs", import.meta.url));
}

test("idle fresh is a hold; worktree branches from origin/main after fetch", () => {
  const result = analyze(seedFresh());
  assert.equal(result.verdict, "fresh");
  assert.equal(result.idleWord, "fresh");
  assert.equal(IDLE_WORD, "fresh");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.fresh, true);
  assert.equal(result.phrase, "admit fresh");
  assert.equal(result.residual, false);
  assert.equal(result.submoduleBase, false);
  assert.equal(result.originMain, true);
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify fresh", () => {
  assert.equal(classify(emptyTicket()), "fresh");
  assert.equal(classify(""), "fresh");
  assert.equal(classify(null), "fresh");
  assert.equal(decide({}), "fresh");
});

test("#93703 seeded path scores monadnock when the peak is residual", () => {
  const result = analyze(seedResidual());
  assert.equal(result.verdict, "monadnock");
  assert.equal(result.seededWord, "residual");
  assert.equal(SEEDED_WORD, "residual");
  assert.equal(PRODUCT_WORD, "monadnock");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.residual, true);
  assert.equal(result.phrase, "score monadnock");
  assert.equal(result.localMain, true);
  assert.equal(result.nestedRepo, true);
  assert.equal(result.rawSha, true);
  assert.equal(result.submoduleBase, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("local-main plus nested-repo is the #93703 monadnock", () => {
  const cairn = inspectCairn({ residual: true, localMain: true });
  assert.equal(cairn.stamp, "residual");
  assert.equal(cairn.residual, true);
  const scored = scoreGate({
    residual: true,
    localMain: true,
    nestedRepo: true,
    rawSha: true,
    behind204: true,
    submoduleBase: true,
    cue: "residual",
    cairn: SAMPLE_CAIRN,
    peak: SAMPLE_PEAK,
  });
  assert.equal(scored.verdict, "monadnock");
  assert.equal(scored.submoduleBase, true);
  const open = inspectCairn({ fresh: true, originMain: true });
  assert.equal(open.stamp, "origin");
});

test("path word is submodule-base; named path seed holds the path", () => {
  assert.equal(PATH_WORD, "submodule-base");
  const result = analyze(seedSubmoduleBase());
  assert.equal(result.verdict, "submodule-base");
  assert.equal(result.pathWord, "submodule-base");
  assert.equal(result.hold, false);
  assert.equal(
    classify({ seed: "submodule-base", preferSeed: true, residual: true }),
    "submodule-base",
  );
  assert.equal(classify(seedLocalMain()), "local-main");
});

test("HOLD includes fresh / hold", () => {
  assert.ok(HOLD.includes("fresh"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: local-main, nested-repo, raw-sha, behind-204", () => {
  assert.equal(classify(seedLocalMain()), "local-main");
  assert.equal(classify(seedNestedRepo()), "nested-repo");
  assert.equal(classify(seedRawSha()), "raw-sha");
  assert.equal(classify(seedBehind204()), "behind-204");
  assert.equal(classify(seedFetchFirst()), "fetch-first");
  assert.equal(classify(seedOriginMain()), "origin-main");
  assert.equal(classify(seedSuperprojectOk()), "superproject-ok");
  assert.equal(classify(seedRefName()), "ref-name");
  assert.equal(classify(seedMonadnock()), "monadnock");
});

test("booth fixtures flip fresh vs residual vs submodule-base vs monadnock", () => {
  const idle = scoreGate(seedFresh());
  const seeded = scoreGate(seedResidual());
  const fresh = readData("fresh.json");
  const residual = readData("residual.json");
  const path = readData("submodule-base.json");
  const product = readData("monadnock.json");
  const localMain = readData("local-main.json");
  const nested = readData("nested-repo.json");
  const raw = readData("raw-sha.json");
  const holdFix = readData("hold.json");
  assert.equal(idle.verdict, "fresh");
  assert.equal(seeded.verdict, "monadnock");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedFresh()), "fresh");
  assert.equal(score(seedResidual()), "monadnock");
  assert.equal(fresh.originMain, true);
  assert.equal(fresh.fresh, true);
  assert.equal(scoreGate(fresh).verdict, "fresh");
  assert.equal(residual.localMain, true);
  assert.equal(residual.nestedRepo, true);
  assert.equal(residual.rawSha, true);
  assert.equal(classify(residual), "residual");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /origin\/main|fresh|fetch/i);
  assert.match(path.paths[1].result, /local main|f84446c12d|204/i);
  assert.equal(classify(path), "submodule-base");
  assert.equal(classify(product), "monadnock");
  assert.equal(product.hubCount, "MONADNOCK");
  assert.equal(residual.issue, 93703);
  assert.equal(residual.residual, true);
  assert.equal(classify(localMain), "local-main");
  assert.equal(classify(nested), "nested-repo");
  assert.equal(classify(raw), "raw-sha");
  assert.equal(classify(holdFix), "hold");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("fresh"));
  assert.ok(CHIPS.includes("residual"));
  assert.ok(CHIPS.includes("monadnock"));
  assert.ok(CHIPS.includes("submodule-base"));
  assert.ok(CHIPS.includes("local-main"));
  assert.ok(CHIPS.includes("chips"));
  assert.ok(CHIPS.includes("fingerprints"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("residual"));
  assert.ok(ALARM.includes("submodule-base"));
  assert.ok(ALARM.includes("local-main"));
  assert.ok(ALARM.includes("monadnock"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "chips", preferSeed: true }), "chips");
  assert.equal(classify({ seed: "fingerprints", preferSeed: true }), "fingerprints");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published monadnock walk scores monadnock after the idle hold", () => {
  const booth = scoreWalk({ rows: MONADNOCK_WALK });
  assert.equal(booth.verdict, "monadnock");
  assert.ok(booth.residualCount >= 1);
  const idle = booth.rows.find((row) => row.event === "cue-fresh");
  assert.equal(idle.fresh, true);
  assert.equal(idle.verdict, "fresh");
  const local = booth.rows.find((row) => row.event === "local-main");
  assert.equal(local.localMain, true);
  const path = booth.rows.find((row) => row.event === "submodule-base");
  assert.equal(path.verdict, "submodule-base");
});

test("MONADNOCK_WALK constant matches the issue survey walk", () => {
  assert.equal(MONADNOCK_WALK[0].event, "cue-fresh");
  const local = MONADNOCK_WALK.find((row) => row.event === "local-main");
  assert.equal(local.localMain, true);
  const path = MONADNOCK_WALK.find((row) => row.event === "submodule-base");
  assert.equal(path.residual, true);
  const scoreRow = MONADNOCK_WALK.find((row) => row.event === "monadnock");
  assert.equal(scoreRow.residual, true);
});

test("positive control origin-main stays fresh", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "fresh");
  const ok = walk.rows.find((row) => row.event === "origin-main");
  assert.equal(ok.verdict, "fresh");
  const hold = walk.rows.find((row) => row.event === "cue-fresh");
  assert.equal(hold.fresh, true);
  assert.equal(hold.verdict, "fresh");
});

test("issue constants encode only #93703 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93703);
  assert.ok(ISSUE_URL.includes("93703"));
  assert.match(TITLE, /worktree/i);
  assert.match(TITLE, /submodule/i);
  assert.match(TITLE, /origin\/main/i);
  assert.equal(STATE, "OPEN");
  assert.ok(LABELS.includes("bug"));
  assert.ok(LABELS.includes("has repro"));
  assert.ok(LABELS.includes("platform:macos"));
  assert.ok(LABELS.includes("area:desktop"));
  assert.equal(PLATFORM, "macos");
  assert.equal(DESKTOP_VERSION, "2.1.260");
  assert.equal(CLI_VERSION, "2.1.220");
  assert.equal(BEHIND_COUNT, 204);
  assert.equal(LOCAL_MAIN_DATE, "2026-08-10");
  assert.equal(ORIGIN_MAIN_SHORT, "a8cef9307a");
  assert.equal(LOCAL_MAIN_SHORT, "f84446c12d");
  assert.equal(LOCAL_MAIN_SHA, "f84446c12d9b6ddee03a4d739bd5f56ce6b90fc4");
  assert.match(REFLOG_DESKTOP, /f84446c12d9b6ddee03a4d739bd5f56ce6b90fc4/);
  assert.match(REFLOG_CLI, /origin\/main/);
  assert.match(REFLOG_SUPER, /refs\/remotes\/origin\/main/);
  assert.equal(EXPECTED_LINE, "Created from refs/remotes/origin/main");
  assert.equal(SURVEY_PLAQUES.length, 4);
  assert.ok(RULED_OUT.some((row) => /CLI|2\.1\.220/.test(row)));
  assert.ok(EXPECTED.some((row) => /refs\/remotes\/origin\/main|fresh|superproject/i.test(row)));
  assert.match(DISTRIBUTION, /204/);
  assert.match(SESSION_KIND, /2\.1\.260|204/);
  assert.equal(BOOTH_STATIONS.length, 5);
  assert.ok(FINGERPRINT_LINES.includes("submodule-base"));
  assert.ok(FINGERPRINT_LINES.includes("residual"));
  assert.match(PHRASE, /Score monadnock or admit fresh/);
  assert.equal(SAMPLE_CAIRN.residual, true);
  assert.equal(SAMPLE_PEAK.standing, true);
  assert.equal(SAMPLE_MASSIF.nested, true);
  assert.equal(SAMPLE_SILL.dry, true);
  assert.equal(SAMPLE_PLATE.rawSha, true);
});

test("has-repro fingerprints encode the published residual survey station", () => {
  const result = handle(seedResidual());
  assert.equal(result.published.platform, "macos");
  assert.match(result.published.sessionKind, /204/);
  assert.match(result.published.reflogDesktop, /f84446c12d/);
  assert.match(
    fingerprint(seedResidual()),
    /monadnock\|cairn=residual\|peak=standing\|massif=nested\|sill=dry\|plate=raw-sha\|path=submodule-base\|cue=submodule-base/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes recent catalog words including Rider and Followspot", () => {
  const required = [
    "plain",
    "ridden",
    "attachment-rider",
    "rider",
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

test("fresh booth flips residual back when origin/main is the base", () => {
  const tape = {
    fresh: true,
    residual: false,
    originMain: true,
    cue: "fresh",
  };
  assert.equal(scoreGate(tape).verdict, "fresh");
  tape.fresh = false;
  tape.residual = true;
  tape.localMain = true;
  tape.nestedRepo = true;
  tape.rawSha = true;
  tape.cue = "residual";
  assert.equal(scoreGate(tape).verdict, "monadnock");
  tape.fresh = true;
  tape.residual = false;
  tape.localMain = false;
  tape.nestedRepo = false;
  tape.rawSha = false;
  tape.cue = "fresh";
  assert.equal(scoreGate(tape).verdict, "fresh");
});

test("cairn, peak, massif, sill, plate, and readBooth mark the residual station", () => {
  const idle = inspectCairn({
    fresh: true,
    originMain: true,
    cairn: { originMain: true, residual: false },
  });
  assert.equal(idle.stamp, "origin");
  const peak = inspectResidualPeak({ residual: true, peak: SAMPLE_PEAK });
  assert.equal(peak.stamp, "standing");
  assert.equal(peak.behind, 204);
  const massif = inspectNestedMassif({
    nestedRepo: true,
    massif: SAMPLE_MASSIF,
  });
  assert.equal(massif.stamp, "nested");
  const sill = inspectFetchSill({ residual: true, submoduleBase: true });
  assert.equal(sill.stamp, "dry");
  const plate = inspectReflogPlate({ residual: true, rawSha: true });
  assert.equal(plate.stamp, "raw-sha");
  const booth = readBooth({
    residual: true,
    localMain: true,
    nestedRepo: true,
    cairn: SAMPLE_CAIRN,
    peak: SAMPLE_PEAK,
  });
  assert.equal(booth.residual, true);
  assert.equal(booth.mark, "residual");
  const open = readBooth({
    fresh: true,
    residual: false,
    originMain: true,
  });
  assert.equal(open.residual, false);
  assert.equal(open.mark, "fresh");
});

test("cousins are cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 4);
  assert.equal(COUSINS[0].issue, 93231);
  assert.equal(COUSINS[1].issue, 93193);
  assert.equal(COUSINS[2].issue, 93081);
  assert.equal(COUSINS[3].issue, 93010);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.match(COUSINS[0].why, /93231|escheat|rebuild/i);
  assert.match(COUSINS[1].why, /93193|mondegreen/i);
  assert.match(COUSINS[2].why, /93081|midden/i);
  assert.match(COUSINS[3].why, /93010|entresol/i);
  assert.ok(NOT_PRODUCTS.includes("rider"));
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
  assert.ok(NOT_PRODUCTS.includes("escheat"));
  assert.ok(NOT_PRODUCTS.includes("mondegreen"));
  assert.ok(NOT_PRODUCTS.includes("midden"));
  assert.ok(NOT_PRODUCTS.includes("entresol"));
  assert.equal(BACKUPS.length, 8);
  assert.equal(BACKUPS[0].issue, 93722);
  assert.equal(BACKUPS[1].issue, 93672);
  assert.equal(BACKUPS[2].issue, 93652);
  assert.equal(BACKUPS[3].issue, 93680);
  assert.equal(BACKUPS[4].issue, 93618);
  assert.equal(BACKUPS[5].issue, 93694);
  assert.equal(BACKUPS[6].issue, 93735);
  assert.equal(BACKUPS[7].issue, 93733);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.match(BACKUPS[0].title, /worktree connector|umbilical/i);
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/residual.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(JSON.parse(idle.stdout).verdict, "fresh");
  assert.equal(JSON.parse(seeded.stdout).verdict, "residual");
});

test("handle exposes published hypothesis and #93703 headline", () => {
  const result = handle(seedResidual());
  assert.equal(result.published.issue, 93703);
  assert.equal(result.published.platform, "macos");
  assert.deepEqual(result.published.cousins, [93231, 93193, 93081, 93010]);
  assert.ok(result.published.backups.includes(93722));
  assert.ok(result.published.backups.includes(93735));
  assert.ok(result.published.backups.includes(93733));
  assert.match(result.published.hypothesis, /nested repo|local default-branch|origin\/<default>|raw SHA/i);
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#93703/);
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is a trig survey station / residual mountain booth, not rider or followspot", () => {
  const page = readPage();
  assert.match(page, /Staatliches/);
  assert.match(page, /Manrope/);
  assert.match(page, /IBM Plex Mono|IBM\+Plex\+Mono/);
  assert.match(page, /monadnock|residual|trig survey|cairn|massif/i);
  assert.match(page, /#2B2F36|#6B8F71|#A8C5D4|#1A1C1F|#C4B8A8|#E8A54B/i);
  assert.match(page, /\bfresh\b/);
  assert.match(page, /\bresidual\b/);
  assert.match(page, /submodule-base/);
  assert.match(page, /Score monadnock or admit fresh/i);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /#302/);
  assert.match(page, /#93703/);
  assert.match(page, /Relevel the station/);
  assert.match(page, /Score monadnock/);
  assert.match(page, /Walk the massif/);
  assert.match(page, /Compare fresh \/ residual/);
  assert.match(page, /Pin idle fresh/);
  assert.match(page, /Pin seeded residual/);
  assert.match(page, /Pin submodule-base/);
  assert.match(page, /Hold the fresh/);
  assert.doesNotMatch(page, /Libre Baskerville|Libre\+Baskerville/);
  assert.doesNotMatch(page, /Source Sans 3|Source\+Sans\+3/);
  assert.doesNotMatch(page, /Oswald/);
  assert.doesNotMatch(page, /Karla/);
  assert.doesNotMatch(page, /Space Mono|Space\+Mono/);
  assert.doesNotMatch(page, /Cinzel/);
  assert.doesNotMatch(page, /Figtree/);
  assert.doesNotMatch(page, /Fira Code|Fira\+Code/);
  assert.doesNotMatch(page, /Fraunces/);
  assert.doesNotMatch(page, /Source Code Pro|Source\+Code\+Pro/);
  assert.doesNotMatch(page, /Cardo/);
  assert.doesNotMatch(page, /Literata/);
  assert.doesNotMatch(page, /Sora/);
  assert.doesNotMatch(page, /Red Hat Mono|Red\+Hat\+Mono/);
  assert.doesNotMatch(page, /DM Sans|DM\+Sans/);
  assert.doesNotMatch(page, /#F4EFE4/);
  assert.doesNotMatch(page, /#9B2D2D/);
  assert.doesNotMatch(page, /#0D0B10/);
  assert.doesNotMatch(page, /#F5C542/);
  assert.doesNotMatch(page, /#8B1E3F/);
  assert.doesNotMatch(page, /#3D5A80/);
  assert.doesNotMatch(page, /#6B4C9A/);
  assert.doesNotMatch(page, /clerk desk|bill-rider|parliamentary|staple-pin/i);
  assert.doesNotMatch(page, /prop belt|operator iris|prompt book/i);
  assert.doesNotMatch(page, /mill weir|millrace|rust gates|MCP millstone|miller/i);
  assert.doesNotMatch(page, /in irons|head-to-wind|WebSearch kite|wind gauge/i);
  assert.doesNotMatch(page, /oak cathead|anchor-timber|slot-vector|placeholder cat|respawn lever|ENXIO/i);
  assert.doesNotMatch(page, /continuity slate|darkroom chronometer|sprocket rail|pre-warm take/i);
  assert.doesNotMatch(page, /saltbush|ticket booth|Eyre mile|brass stamp|empty-bearer/i);
  assert.doesNotMatch(page, /siege petard|powder-charge|sapper trench|fuse rail|argv mirror/i);
  assert.doesNotMatch(page, /fasti|nundinal|kalends|acta diurna|catch-up hand/i);
  assert.doesNotMatch(page, /offstage waiting|Queue for later|chat:queueSubmit/i);
  assert.doesNotMatch(page, /\bplain\b/);
  assert.doesNotMatch(page, /\bridden\b/);
  assert.doesNotMatch(page, /attachment-rider/);
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
  assert.match(page, /NOT Rider/i);
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
  assert.match(page, /NOT Escheat/i);
  assert.match(page, /NOT Mondegreen/i);
  assert.match(page, /NOT Midden/i);
  assert.match(page, /NOT Entresol/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Monadnock/);
  assert.match(readme, /#93703/);
  assert.match(readme, /\bfresh\b/);
  assert.match(readme, /\bresidual\b/);
  assert.match(readme, /submodule-base/);
  assert.match(readme, /Staatliches/);
  assert.match(readme, /Manrope/);
  assert.match(readme, /IBM Plex Mono/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /NOT Rider/i);
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
  assert.match(readme, /NOT Escheat/i);
  assert.match(readme, /NOT Mondegreen/i);
  assert.match(readme, /NOT Midden/i);
  assert.match(readme, /NOT Entresol/i);
  assert.match(readme, /#93231/);
  assert.match(readme, /#93193/);
  assert.match(readme, /#93081/);
  assert.match(readme, /#93010/);
  assert.match(readme, /204|origin\/main|raw SHA|submodule/);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/monadnock/);
  assert.match(readme, /node --test projects\/monadnock\/monadnock\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /trig survey|residual|cairn|massif|monadnock/i);
  assert.match(readme, /Score monadnock or admit fresh/);
  assert.match(readme, /#93722|#93672|#93652|#93680|#93618|#93694|#93735|#93733/);
});

test("catalog features Monadnock only; Rider unfeatured", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 302);
  assert.equal(hub.products.length, 302);
  assert.equal(catalog.products[0].name, "Monadnock");
  assert.equal(catalog.products[0].slug, "monadnock");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/monadnock/");
  assert.equal(catalog.products[0].day, "2026-09-12");
  assert.match(catalog.products[0].summary, /Trig survey booth/);
  assert.match(catalog.products[0].summary, /submodule worktrees/);
  assert.match(catalog.products[0].summary, /origin\/main/);
  assert.equal(hub.products[0].slug, "monadnock");
  assert.equal(hub.products[0].featured, true);
  const rider = catalog.products.find((row) => row.slug === "rider");
  assert.ok(rider);
  assert.equal(rider.featured, false);
  const followspot = catalog.products.find((row) => row.slug === "followspot");
  assert.ok(followspot);
  assert.equal(followspot.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "monadnock").length, 1);
  assert.ok(!catalog.products.some((row) => String(row.summary || "").includes("93703") && row.slug !== "monadnock"));
});

test("vercel rewrites monadnock to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/monadnock");
  assert.equal(vercel.rewrites[0].destination, "/projects/monadnock");
  assert.equal(vercel.rewrites[1].source, "/monadnock/");
  assert.equal(vercel.rewrites[1].destination, "/projects/monadnock");
  assert.equal(vercel.rewrites[2].source, "/monadnock/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/monadnock/:path*");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /\bcurl\b/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
