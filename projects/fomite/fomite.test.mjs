import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  AGENTS,
  ALARM,
  AUTHOR,
  BACKUPS,
  BENCH_STATIONS,
  CACHE_PATH,
  CHIPS,
  CHECKOUT,
  CLAUDE_CODE_VERSION,
  COPY_TABLE,
  COUSINS,
  ENV_CACHE_PATH,
  ENV_PROBE,
  FEATURED_ISSUE,
  FILED,
  FINGERPRINT_LINES,
  FOMITE_WALK,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  HOLD,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  MARKETPLACE,
  MEASURED_CACHE,
  MEASURED_NODE_MODULES,
  MEASURED_TRACKED,
  NOT_PRODUCTS,
  OS,
  OS_VERSION,
  PATH_WORD,
  PHRASE,
  PLUGIN,
  PLUGIN_VERSION,
  PRODUCT_WORD,
  SCRATCH,
  SEEDED_WORD,
  SKILLS,
  STATE,
  TITLE,
  VERDICTS,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  inspectCacheCopy,
  inspectEnvHitch,
  inspectGitignore,
  readBench,
  score,
  scoreGate,
  scoreWalk,
  seedCacheBloat,
  seedContaminated,
  seedDirectorySource,
  seedEnvHitch,
  seedExcludesGit,
  seedFomite,
  seedGitignore,
  seedHold,
  seedNoWarning,
  seedNodeModules,
  seedPersists,
  seedScrubbed,
  seedSkipGitignore,
} from "./fomite.mjs";

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
  return fileURLToPath(new URL("./fomite.mjs", import.meta.url));
}

test("idle scrubbed is a hold; gitignore honored; no .env / node_modules", () => {
  const result = analyze(seedScrubbed());
  assert.equal(result.verdict, "scrubbed");
  assert.equal(result.idleWord, "scrubbed");
  assert.equal(IDLE_WORD, "scrubbed");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.scrubbed, true);
  assert.equal(result.phrase, "admit scrubbed");
  assert.equal(result.gitignoreHonored, true);
  assert.equal(result.envHitch, false);
  assert.equal(result.nodeModulesCopied, false);
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify scrubbed", () => {
  assert.equal(classify(emptyTicket()), "scrubbed");
  assert.equal(classify(""), "scrubbed");
  assert.equal(classify(null), "scrubbed");
  assert.equal(decide({}), "scrubbed");
});

test("#93423 seeded path scores contaminated when .env and node_modules hitch", () => {
  const result = analyze(seedContaminated());
  assert.equal(result.verdict, "contaminated");
  assert.equal(result.seededWord, "contaminated");
  assert.equal(SEEDED_WORD, "contaminated");
  assert.equal(PRODUCT_WORD, "fomite");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.contaminated, true);
  assert.equal(result.phrase, "score fomite");
  assert.equal(result.envHitch, true);
  assert.equal(result.nodeModulesCopied, true);
  assert.equal(result.skipGitignore, true);
  assert.equal(result.noWarning, true);
  assert.equal(result.cacheSize, "128M");
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("gitignore unread plus .env hitch is the #93423 fomite", () => {
  const ignore = inspectGitignore({
    skipGitignore: true,
    gitignoreHonored: false,
  });
  assert.equal(ignore.stamp, "contaminated");
  assert.equal(ignore.unread, true);
  const scored = scoreGate({
    contaminated: true,
    skipGitignore: true,
    envHitch: true,
    nodeModulesCopied: true,
    cacheSize: "128M",
    cue: "contaminated",
  });
  assert.equal(scored.verdict, "contaminated");
  assert.equal(scored.envHitch, true);
  const calm = inspectEnvHitch({ scrubbed: true });
  assert.equal(calm.stamp, "scrubbed");
});

test("path word is gitignore; named path seed holds the path", () => {
  assert.equal(PATH_WORD, "gitignore");
  const result = analyze(seedGitignore());
  assert.equal(result.verdict, "gitignore");
  assert.equal(result.pathWord, "gitignore");
  assert.equal(result.hold, false);
  assert.equal(
    classify({ seed: "gitignore", preferSeed: true, contaminated: true }),
    "gitignore",
  );
  assert.equal(classify(seedSkipGitignore()), "skip-gitignore");
});

test("HOLD includes scrubbed / hold", () => {
  assert.ok(HOLD.includes("scrubbed"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: env-hitch, node-modules, cache-bloat, no-warning, excludes-git, skip-gitignore, directory, persists", () => {
  assert.equal(classify(seedEnvHitch()), "env-hitch");
  assert.equal(classify(seedNodeModules()), "node-modules");
  assert.equal(classify(seedCacheBloat()), "cache-bloat");
  assert.equal(classify(seedNoWarning()), "no-warning");
  assert.equal(classify(seedExcludesGit()), "excludes-git");
  assert.equal(classify(seedSkipGitignore()), "skip-gitignore");
  assert.equal(classify(seedDirectorySource()), "directory-source");
  assert.equal(classify(seedPersists()), "persists");
  assert.equal(classify(seedFomite()), "fomite");
});

test("bench fixtures flip scrubbed vs contaminated vs gitignore", () => {
  const idle = scoreGate(seedScrubbed());
  const seeded = scoreGate(readData("contaminated.json"));
  const scrubbed = readData("scrubbed.json");
  const contaminated = readData("contaminated.json");
  const ignore = readData("gitignore.json");
  const product = readData("fomite.json");
  const env = readData("env-hitch.json");
  const nm = readData("node-modules.json");
  assert.equal(idle.verdict, "scrubbed");
  assert.equal(seeded.verdict, "contaminated");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedScrubbed()), "scrubbed");
  assert.equal(score(readData("contaminated.json")), "contaminated");
  assert.equal(scrubbed.cacheSize, "4.5M");
  assert.equal(scrubbed.gitignoreHonored, true);
  assert.equal(scoreGate(scrubbed).verdict, "scrubbed");
  assert.equal(contaminated.cacheSize, "128M");
  assert.equal(contaminated.envHitch, true);
  assert.equal(contaminated.nodeModulesCopied, true);
  assert.equal(classify(contaminated), "contaminated");
  assert.equal(ignore.paths.length, 3);
  assert.equal(ignore.paths[0].result, "already excluded");
  assert.equal(ignore.paths[1].rule, ".gitignore");
  assert.equal(ignore.paths[1].result, "never read");
  assert.equal(classify(ignore), "gitignore");
  assert.equal(classify(product), "fomite");
  assert.equal(classify(env), "env-hitch");
  assert.equal(classify(nm), "node-modules");
  assert.equal(contaminated.issue, 93423);
  assert.match(contaminated.envProbe, /TEAM_DEV_COPY_PROBE/);
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("scrubbed"));
  assert.ok(CHIPS.includes("contaminated"));
  assert.ok(CHIPS.includes("fomite"));
  assert.ok(CHIPS.includes("gitignore"));
  assert.ok(CHIPS.includes("chips"));
  assert.ok(CHIPS.includes("fingerprints"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("contaminated"));
  assert.ok(ALARM.includes("gitignore"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "chips", preferSeed: true }), "chips");
  assert.equal(classify({ seed: "fingerprints", preferSeed: true }), "fingerprints");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published fomite walk scores contaminated after the idle hold", () => {
  const desk = scoreWalk({ rows: FOMITE_WALK });
  assert.equal(desk.verdict, "contaminated");
  assert.ok(desk.contaminatedCount >= 1);
  const idle = desk.rows.find((row) => row.event === "cue-scrubbed");
  assert.equal(idle.scrubbed, true);
  assert.equal(idle.verdict, "scrubbed");
  const add = desk.rows.find((row) => row.event === "marketplace-add");
  assert.equal(add.directorySource, true);
  const install = desk.rows.find((row) => row.event === "plugin-install");
  assert.equal(install.contaminated, true);
  const git = desk.rows.find((row) => row.event === "copy-excludes-git");
  assert.equal(git.excludesGit, true);
  const skip = desk.rows.find((row) => row.event === "skip-gitignore");
  assert.equal(skip.skipGitignore, true);
  const env = desk.rows.find((row) => row.event === "env-hitch");
  assert.equal(env.envHitch, true);
  const nm = desk.rows.find((row) => row.event === "node-modules-51M");
  assert.equal(nm.nodeModulesSize, "51M");
  const size = desk.rows.find((row) => row.event === "cache-128M");
  assert.equal(size.cacheSize, "128M");
  const warn = desk.rows.find((row) => row.event === "no-warning");
  assert.equal(warn.noWarning, true);
  const stain = desk.rows.find((row) => row.event === "contaminated");
  assert.equal(stain.contaminated, true);
  const path = desk.rows.find((row) => row.event === "gitignore");
  assert.equal(path.verdict, "gitignore");
});

test("FOMITE_WALK constant matches the issue bench walk", () => {
  assert.equal(FOMITE_WALK[0].event, "cue-scrubbed");
  const env = FOMITE_WALK.find((row) => row.event === "env-hitch");
  assert.equal(env.envProbe, ENV_PROBE);
  const stain = FOMITE_WALK.find((row) => row.event === "contaminated");
  assert.equal(stain.envHitch, true);
  assert.equal(stain.skipGitignore, true);
  const path = FOMITE_WALK.find((row) => row.event === "gitignore");
  assert.equal(path.contaminated, true);
  const scoreRow = FOMITE_WALK.find((row) => row.event === "fomite");
  assert.equal(scoreRow.contaminated, true);
});

test("issue constants encode only #93423 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93423);
  assert.ok(ISSUE_URL.includes("93423"));
  assert.match(TITLE, /plugin install copies gitignored files/);
  assert.match(TITLE, /root \.env/);
  assert.equal(STATE, "OPEN");
  assert.ok(LABELS.includes("bug"));
  assert.ok(LABELS.includes("has repro"));
  assert.ok(LABELS.includes("platform:macos"));
  assert.ok(LABELS.includes("area:security"));
  assert.ok(LABELS.includes("area:plugins"));
  assert.equal(AUTHOR, "bostonaholic");
  assert.equal(FILED, "2026-09-10T17:37:24Z");
  assert.equal(CLAUDE_CODE_VERSION, "2.1.266");
  assert.equal(OS, "macOS");
  assert.equal(OS_VERSION, "26.6.2");
  assert.equal(MARKETPLACE, "team-dev");
  assert.equal(PLUGIN, "team");
  assert.equal(PLUGIN_VERSION, "0.97.0-claude.20260910173552");
  assert.equal(MEASURED_CACHE, "128M");
  assert.equal(MEASURED_TRACKED, "4.5M");
  assert.equal(MEASURED_NODE_MODULES, "51M");
  assert.equal(SKILLS, 90);
  assert.equal(AGENTS, 13);
  assert.equal(CHECKOUT, "github.com/bostonaholic/team");
  assert.equal(ENV_PROBE, "TEAM_DEV_COPY_PROBE=not-a-real-secret");
  assert.match(ENV_CACHE_PATH, /team-dev\/team/);
  assert.equal(CACHE_PATH, "~/.claude/plugins/cache/<marketplace>/<plugin>/<version>/");
  assert.deepEqual(SCRATCH, [
    ".playwright-mcp/",
    ".claude/worktrees/",
    ".agents/friction-log/",
  ]);
  assert.equal(COPY_TABLE.length, 6);
  assert.equal(COPY_TABLE[0].name, ".git");
  assert.equal(COPY_TABLE[0].copied, false);
  assert.equal(COPY_TABLE[1].name, ".env");
  assert.equal(COPY_TABLE[1].copied, true);
  assert.equal(BENCH_STATIONS.length, 4);
  assert.ok(FINGERPRINT_LINES.includes("env-hitch"));
  assert.ok(FINGERPRINT_LINES.includes("skip-gitignore"));
  assert.match(PHRASE, /score fomite or admit scrubbed/);
});

test("has-repro fingerprints encode the published directory-marketplace window", () => {
  const result = handle(readData("contaminated.json"));
  assert.equal(result.published.claudeCodeVersion, "2.1.266");
  assert.equal(result.published.author, "bostonaholic");
  assert.equal(result.published.os, "macOS");
  assert.equal(result.published.osVersion, "26.6.2");
  assert.equal(result.published.measuredCache, "128M");
  assert.equal(result.published.measuredTracked, "4.5M");
  assert.equal(result.published.measuredNodeModules, "51M");
  assert.equal(result.published.envProbe, ENV_PROBE);
  assert.match(
    fingerprint(seedContaminated()),
    /contaminated\|ignore=unread\|env=hitch\|nm=copied\|cache=128M\|cue=contaminated/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes recent catalog words including Fosse and Graft", () => {
  const required = [
    "mounted",
    "fossed",
    "plan9",
    "fosse",
    "warm",
    "paged-out",
    "majflt",
    "hibernacle",
    "honest",
    "scapegoated",
    "ungranted",
    "scapegoat",
    "cleared",
    "grafted",
    "copy-forward",
    "graft",
    "damped",
    "spinning",
    "mux",
    "snubber",
    "slipped",
    "sprung",
    "springe",
    "bound",
    "accreted",
    "cartulary",
    "sealed",
    "paraph",
    "routed",
    "appanage",
    "afloat",
    "pontoon",
    "concordant",
    "reaped",
    "revenant",
    "oubliette",
    "voided",
    "vernier",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("scrubbed bench flips contaminated back when gitignore is honored", () => {
  const tape = {
    scrubbed: true,
    gitignoreHonored: true,
    envHitch: false,
    nodeModulesCopied: false,
    contaminated: false,
    cue: "scrubbed",
  };
  assert.equal(scoreGate(tape).verdict, "scrubbed");
  tape.scrubbed = false;
  tape.contaminated = true;
  tape.envHitch = true;
  tape.skipGitignore = true;
  tape.cue = "contaminated";
  assert.equal(scoreGate(tape).verdict, "contaminated");
  tape.scrubbed = true;
  tape.contaminated = false;
  tape.envHitch = false;
  tape.skipGitignore = false;
  tape.gitignoreHonored = true;
  tape.cue = "scrubbed";
  assert.equal(scoreGate(tape).verdict, "scrubbed");
});

test("gitignore, env hitch, cache copy, and bench mark fomite after .env", () => {
  const idle = inspectGitignore({ gitignoreHonored: true, scrubbed: true });
  assert.equal(idle.stamp, "scrubbed");
  const hitch = inspectEnvHitch({
    envHitch: true,
    envProbe: ENV_PROBE,
  });
  assert.equal(hitch.stamp, "contaminated");
  assert.equal(hitch.hitch, true);
  const cache = inspectCacheCopy({
    nodeModulesCopied: true,
    cacheSize: "128M",
  });
  assert.equal(cache.stamp, "contaminated");
  assert.equal(cache.nodeModulesSize, "51M");
  const desk = readBench({
    contaminated: true,
    skipGitignore: true,
    envHitch: true,
  });
  assert.equal(desk.contaminated, true);
  assert.equal(desk.mark, "contaminated");
  const calm = readBench({
    scrubbed: true,
    gitignoreHonored: true,
    contaminated: false,
  });
  assert.equal(calm.contaminated, false);
  assert.equal(calm.mark, "scrubbed");
});

test("cousins are cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 2);
  assert.equal(COUSINS[0].issue, 93426);
  assert.equal(COUSINS[1].issue, 92354);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("fosse"));
  assert.ok(NOT_PRODUCTS.includes("hibernacle"));
  assert.ok(NOT_PRODUCTS.includes("scapegoat"));
  assert.ok(NOT_PRODUCTS.includes("graft"));
  assert.ok(NOT_PRODUCTS.includes("snubber"));
  assert.ok(NOT_PRODUCTS.includes("springe"));
  assert.ok(NOT_PRODUCTS.includes("cartulary"));
  assert.ok(NOT_PRODUCTS.includes("paraph"));
  assert.ok(NOT_PRODUCTS.includes("vernier"));
  assert.equal(BACKUPS.length, 5);
  assert.equal(BACKUPS[0].issue, 93429);
  assert.equal(BACKUPS[1].issue, 93403);
  assert.equal(BACKUPS[2].issue, 93405);
  assert.equal(BACKUPS[3].issue, 93402);
  assert.equal(BACKUPS[4].issue, 93426);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/contaminated.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(JSON.parse(idle.stdout).verdict, "scrubbed");
  assert.equal(JSON.parse(seeded.stdout).verdict, "contaminated");
});

test("handle exposes published hypothesis and #93423 headline", () => {
  const result = handle(readData("contaminated.json"));
  assert.equal(result.published.issue, 93423);
  assert.equal(result.published.claudeCodeVersion, "2.1.266");
  assert.equal(result.published.author, "bostonaholic");
  assert.equal(result.published.osVersion, "26.6.2");
  assert.deepEqual(result.published.cousins, [93426, 92354]);
  assert.ok(result.published.backups.includes(93429));
  assert.ok(result.published.backups.includes(93403));
  assert.ok(result.published.backups.includes(93402));
  assert.match(result.published.hypothesis, /naive copy that excludes \.git/);
  assert.match(result.published.hypothesis, /NON-BINDING/);
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is a sterile-lab fomite, not an earthwork fosse or orchard graft", () => {
  const page = readPage();
  assert.match(page, /Alegreya/);
  assert.match(page, /Nunito Sans/);
  assert.match(page, /Fira Code/);
  assert.match(page, /fomite|sterile|culture dish|glass slide|agar|pathogen|epidemiolog/i);
  assert.match(page, /#f3f7f6|#0d7377|#c99212|#b42318|#2ec4ce/);
  assert.match(page, /scrubbed/);
  assert.match(page, /contaminated/);
  assert.match(page, /gitignore/);
  assert.match(page, /score fomite or admit scrubbed/i);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /03:50/);
  assert.match(page, /#276/);
  assert.match(page, /#93423/);
  assert.match(page, /bostonaholic/);
  assert.match(page, /2\.1\.266/);
  assert.match(page, /TEAM_DEV_COPY_PROBE|not-a-real-secret/);
  assert.match(page, /128M/);
  assert.match(page, /4\.5M/);
  assert.match(page, /Culture the slide/);
  assert.match(page, /Score fomite/);
  assert.match(page, /Stain the dish/);
  assert.match(page, /Audit the hitch/);
  assert.doesNotMatch(page, /Source Serif 4/);
  assert.doesNotMatch(page, /Karla/);
  assert.doesNotMatch(page, /Roboto Mono/);
  assert.doesNotMatch(page, /Cormorant Garamond/);
  assert.doesNotMatch(page, /Literata/);
  assert.doesNotMatch(page, /Libre Bodoni/);
  assert.doesNotMatch(page, /#12100e/);
  assert.doesNotMatch(page, /#3d3429/);
  assert.doesNotMatch(page, /#d4cfc4/);
  assert.doesNotMatch(page, /wet clay|sod lip|chalk survey|iron spike|guest void/i);
  assert.doesNotMatch(page, /orchard|cambium|scion-stock|pruning-knife/i);
  assert.doesNotMatch(page, /ash altar|goat-bell|bone linen|grant-table/i);
  assert.doesNotMatch(page, /winter hibernacle|majflt|working.set/i);
  assert.doesNotMatch(page, /pulse-damper|srt-mux|EPIPE/i);
  assert.doesNotMatch(page, /millimeter-slider|woodworking leftover/i);
  assert.doesNotMatch(page, /\bfosse\b/);
  assert.doesNotMatch(page, /\bmounted\b/);
  assert.doesNotMatch(page, /\bfossed\b/);
  assert.doesNotMatch(page, /\bplan9\b/);
  assert.doesNotMatch(page, /\bgrafted\b/);
  assert.doesNotMatch(page, /\bcleared\b/);
  assert.doesNotMatch(page, /\bhibernacle\b/);
  assert.match(page, /NOT Fosse/i);
  assert.match(page, /NOT Hibernacle/i);
  assert.match(page, /NOT Snubber/i);
  assert.match(page, /NOT Graft/i);
  assert.match(page, /NOT Springe/i);
  assert.match(page, /NOT Scapegoat/i);
  assert.match(page, /NOT Vernier/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Fomite/);
  assert.match(readme, /#93423/);
  assert.match(readme, /scrubbed/);
  assert.match(readme, /contaminated/);
  assert.match(readme, /gitignore/);
  assert.match(readme, /Alegreya/);
  assert.match(readme, /Nunito Sans/);
  assert.match(readme, /Fira Code/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /NOT Fosse/i);
  assert.match(readme, /NOT Hibernacle/i);
  assert.match(readme, /NOT Snubber/i);
  assert.match(readme, /NOT Graft/i);
  assert.match(readme, /NOT Springe/i);
  assert.match(readme, /NOT leftover woodworking/i);
  assert.match(readme, /2\.1\.266/);
  assert.match(readme, /128M/);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/fomite/);
  assert.match(readme, /node --test projects\/fomite\/fomite\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /naive copy that excludes [`']?\.git/);
  assert.match(readme, /#93426/);
  assert.match(readme, /#92354/);
  assert.match(readme, /#93429/);
  assert.match(readme, /sterile-lab \/ epidemiology/);
  assert.match(readme, /directory marketplace/);
});

test("catalog features Fomite only; Fosse and Hibernacle unfeatured", () => {
  const catalog = readCatalog();
  assert.equal(catalog.products.length, 276);
  assert.equal(catalog.products[0].name, "Fomite");
  assert.equal(catalog.products[0].slug, "fomite");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/fomite/");
  assert.equal(catalog.products[0].day, "2026-09-11");
  assert.match(catalog.products[0].summary, /03:50/);
  assert.match(catalog.products[0].summary, /fomite/);
  assert.match(catalog.products[0].summary, /#93423/);
  assert.match(catalog.products[0].summary, /scrubbed/);
  assert.match(catalog.products[0].summary, /contaminated/);
  assert.match(catalog.products[0].summary, /gitignore/);
  const snubber = catalog.products.find((row) => row.slug === "snubber");
  assert.ok(snubber);
  assert.equal(snubber.featured, false);
  const fosse = catalog.products.find((row) => row.slug === "fosse");
  assert.ok(fosse);
  assert.equal(fosse.featured, false);
  const hibernacle = catalog.products.find((row) => row.slug === "hibernacle");
  assert.ok(hibernacle);
  assert.equal(hibernacle.featured, false);
  const scapegoat = catalog.products.find((row) => row.slug === "scapegoat");
  assert.ok(scapegoat);
  assert.equal(scapegoat.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "fomite").length, 1);
  assert.ok(!catalog.products.some((row) => String(row.summary || "").includes("93423") && row.slug !== "fomite"));
});

test("vercel rewrites fomite to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/fomite");
  assert.equal(vercel.rewrites[0].destination, "/projects/fomite");
  assert.equal(vercel.rewrites[1].source, "/fomite/");
  assert.equal(vercel.rewrites[1].destination, "/projects/fomite");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /\bcurl\b/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
