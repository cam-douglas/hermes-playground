import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  ASK,
  AUTHOR,
  BACKUPS,
  BANNER,
  BENCH_STATIONS,
  CHANGELOG_FIX,
  CHIPS,
  CLAUDE_CODE_VERSION,
  COUSINS,
  FEATURED_ISSUE,
  FILED,
  FINGERPRINT_LINES,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  GOAL_NOTE,
  HOLD,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  NOT_PRODUCTS,
  PATH_WORD,
  PHRASE,
  PRODUCT_WORD,
  PROMPT,
  RELATED_NOOP,
  SEEDED_WORD,
  SESSION_KIND,
  SKILL,
  SKILL_WAIT,
  SKILLS_WAKEUP,
  STATE,
  STROBE_WALK,
  TERMINAL,
  TITLE,
  TOOL_DIRECT,
  TOOL_SCOPE,
  VERDICTS,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  inspectBanner,
  inspectLoop,
  inspectPrompt,
  inspectSkills,
  inspectWakeup,
  readRail,
  score,
  scoreGate,
  scoreWalk,
  seedChangelog257,
  seedGoalCondition,
  seedHold,
  seedInteractive,
  seedLoopBanner,
  seedNeverLoop,
  seedNoop88205,
  seedOffLabel,
  seedPromptRedeliver,
  seedScheduleWakeup,
  seedSkillsTruncated,
  seedSteady,
  seedStrobe,
  seedStrobing,
  seedSubagentDriven,
  seedTmux,
} from "./strobe.mjs";

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
  return fileURLToPath(new URL("./strobe.mjs", import.meta.url));
}

test("idle steady is a hold; no /loop; ScheduleWakeup not called off-label; full skills; no false loop banner", () => {
  const result = analyze(seedSteady());
  assert.equal(result.verdict, "steady");
  assert.equal(result.idleWord, "steady");
  assert.equal(IDLE_WORD, "steady");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.steady, true);
  assert.equal(result.phrase, "admit steady");
  assert.equal(result.scheduleWakeup, false);
  assert.equal(result.loopBanner, false);
  assert.equal(result.skillsTruncated, false);
  assert.equal(result.promptRedelivered, false);
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify steady", () => {
  assert.equal(classify(emptyTicket()), "steady");
  assert.equal(classify(""), "steady");
  assert.equal(classify(null), "steady");
  assert.equal(decide({}), "steady");
});

test("#93468 seeded path scores strobing when off-label ScheduleWakeup paints loop UI", () => {
  const result = analyze(seedStrobing());
  assert.equal(result.verdict, "strobing");
  assert.equal(result.seededWord, "strobing");
  assert.equal(SEEDED_WORD, "strobing");
  assert.equal(PRODUCT_WORD, "strobe");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.strobing, true);
  assert.equal(result.phrase, "score strobe");
  assert.equal(result.scheduleWakeup, true);
  assert.equal(result.offLabel, true);
  assert.equal(result.neverLoop, true);
  assert.equal(result.loopBanner, true);
  assert.equal(result.skillsTruncated, true);
  assert.equal(result.promptRedelivered, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("off-label ScheduleWakeup plus never /loop is the #93468 strobe", () => {
  const wakeup = inspectWakeup({
    scheduleWakeup: true,
    offLabel: true,
    neverLoop: true,
  });
  assert.equal(wakeup.stamp, "strobing");
  assert.equal(wakeup.offLabel, true);
  const scored = scoreGate({
    strobing: true,
    scheduleWakeup: true,
    offLabel: true,
    neverLoop: true,
    loopBanner: true,
    skillsTruncated: true,
    promptRedelivered: true,
    cue: "strobing",
  });
  assert.equal(scored.verdict, "strobing");
  assert.equal(scored.loopBanner, true);
  const calm = inspectBanner({ steady: true });
  assert.equal(calm.stamp, "steady");
});

test("path word is off-label; named path seed holds the path", () => {
  assert.equal(PATH_WORD, "off-label");
  const result = analyze(seedOffLabel());
  assert.equal(result.verdict, "off-label");
  assert.equal(result.pathWord, "off-label");
  assert.equal(result.hold, false);
  assert.equal(
    classify({ seed: "off-label", preferSeed: true, strobing: true }),
    "off-label",
  );
  assert.equal(classify(seedScheduleWakeup()), "schedule-wakeup");
});

test("HOLD includes steady / hold", () => {
  assert.ok(HOLD.includes("steady"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: schedule-wakeup, never-loop, loop-banner, skills-truncated, prompt-redeliver, interactive, tmux, subagent-driven, noop-88205", () => {
  assert.equal(classify(seedScheduleWakeup()), "schedule-wakeup");
  assert.equal(classify(seedNeverLoop()), "never-loop");
  assert.equal(classify(seedLoopBanner()), "loop-banner");
  assert.equal(classify(seedSkillsTruncated()), "skills-truncated");
  assert.equal(classify(seedPromptRedeliver()), "prompt-redeliver");
  assert.equal(classify(seedInteractive()), "interactive");
  assert.equal(classify(seedTmux()), "tmux");
  assert.equal(classify(seedSubagentDriven()), "subagent-driven");
  assert.equal(classify(seedNoop88205()), "noop-88205");
  assert.equal(classify(seedChangelog257()), "changelog-257");
  assert.equal(classify(seedGoalCondition()), "goal-condition");
  assert.equal(classify(seedStrobe()), "strobe");
});

test("booth fixtures flip steady vs strobing vs off-label", () => {
  const idle = scoreGate(seedSteady());
  const seeded = scoreGate(readData("strobing.json"));
  const steady = readData("steady.json");
  const strobing = readData("strobing.json");
  const path = readData("off-label.json");
  const product = readData("strobe.json");
  assert.equal(idle.verdict, "steady");
  assert.equal(seeded.verdict, "strobing");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedSteady()), "steady");
  assert.equal(score(readData("strobing.json")), "strobing");
  assert.equal(steady.neverLoop, true);
  assert.equal(steady.steady, true);
  assert.equal(scoreGate(steady).verdict, "steady");
  assert.equal(strobing.banner, BANNER);
  assert.equal(strobing.prompt, PROMPT);
  assert.equal(strobing.scheduleWakeup, true);
  assert.equal(strobing.offLabel, true);
  assert.equal(classify(strobing), "strobing");
  assert.equal(path.paths.length, 3);
  assert.equal(path.paths[0].rule, "ScheduleWakeup description: /loop dynamic mode; you don't call it directly");
  assert.equal(path.paths[2].result, "off-label ScheduleWakeup");
  assert.equal(classify(path), "off-label");
  assert.equal(classify(product), "strobe");
  assert.equal(strobing.issue, 93468);
  assert.match(strobing.banner, /Claude resuming \/loop wakeup/);
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("steady"));
  assert.ok(CHIPS.includes("strobing"));
  assert.ok(CHIPS.includes("strobe"));
  assert.ok(CHIPS.includes("off-label"));
  assert.ok(CHIPS.includes("chips"));
  assert.ok(CHIPS.includes("fingerprints"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("strobing"));
  assert.ok(ALARM.includes("off-label"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "chips", preferSeed: true }), "chips");
  assert.equal(classify({ seed: "fingerprints", preferSeed: true }), "fingerprints");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published strobe walk scores strobing after the idle hold", () => {
  const desk = scoreWalk({ rows: STROBE_WALK });
  assert.equal(desk.verdict, "strobing");
  assert.ok(desk.strobingCount >= 1);
  const idle = desk.rows.find((row) => row.event === "cue-steady");
  assert.equal(idle.steady, true);
  assert.equal(idle.verdict, "steady");
  const skill = desk.rows.find((row) => row.event === "bounded-wait");
  assert.equal(skill.skill, SKILL);
  const dispatch = desk.rows.find((row) => row.event === "implementer-wait");
  assert.equal(dispatch.implementer, true);
  const call = desk.rows.find((row) => row.event === "schedule-wakeup-off-label");
  assert.equal(call.scheduleWakeup, true);
  assert.equal(call.offLabel, true);
  const banner = desk.rows.find((row) => row.event === "loop-banner");
  assert.equal(banner.loopBanner, true);
  assert.equal(banner.banner, BANNER);
  const skills = desk.rows.find((row) => row.event === "skills-truncated");
  assert.equal(skills.skillsTruncated, true);
  const redeliver = desk.rows.find((row) => row.event === "prompt-redeliver");
  assert.equal(redeliver.promptRedelivered, true);
  const flash = desk.rows.find((row) => row.event === "strobing");
  assert.equal(flash.strobing, true);
  const path = desk.rows.find((row) => row.event === "off-label");
  assert.equal(path.verdict, "off-label");
});

test("STROBE_WALK constant matches the issue hangar walk", () => {
  assert.equal(STROBE_WALK[0].event, "cue-steady");
  const call = STROBE_WALK.find((row) => row.event === "schedule-wakeup-off-label");
  assert.equal(call.offLabel, true);
  const flash = STROBE_WALK.find((row) => row.event === "strobing");
  assert.equal(flash.loopBanner, true);
  assert.equal(flash.skillsTruncated, true);
  const path = STROBE_WALK.find((row) => row.event === "off-label");
  assert.equal(path.strobing, true);
  const scoreRow = STROBE_WALK.find((row) => row.event === "strobe");
  assert.equal(scoreRow.strobing, true);
});

test("issue constants encode only #93468 published facts", () => {
  assert.equal(FEATURED_ISSUE, 93468);
  assert.ok(ISSUE_URL.includes("93468"));
  assert.match(TITLE, /ScheduleWakeup off-label use outside \/loop/);
  assert.equal(STATE, "OPEN");
  assert.ok(LABELS.includes("bug"));
  assert.ok(LABELS.includes("has repro"));
  assert.ok(LABELS.includes("area:core"));
  assert.equal(AUTHOR, "lanej");
  assert.equal(FILED, "2026-09-10T20:35:57Z");
  assert.equal(CLAUDE_CODE_VERSION, "2.1.267");
  assert.equal(CHANGELOG_FIX, "2.1.257");
  assert.equal(RELATED_NOOP, 88205);
  assert.equal(SESSION_KIND, "interactive");
  assert.equal(TERMINAL, "tmux");
  assert.equal(SKILL, "subagent-driven-development");
  assert.match(SKILL_WAIT, /wait in bounded stretches/);
  assert.equal(BANNER, "Claude resuming /loop wakeup (...)");
  assert.equal(SKILLS_WAKEUP, "1 skill available");
  assert.equal(PROMPT, "check whether Task N's implementer has reported");
  assert.equal(TOOL_SCOPE, "/loop dynamic mode");
  assert.equal(TOOL_DIRECT, "you don't call it directly");
  assert.equal(GOAL_NOTE, "condition-driven, not wait-and-resume");
  assert.match(ASK, /safe\/rejected-cleanly outside \/loop/);
  assert.equal(BENCH_STATIONS.length, 4);
  assert.ok(FINGERPRINT_LINES.includes("schedule-wakeup"));
  assert.ok(FINGERPRINT_LINES.includes("loop-banner"));
  assert.match(PHRASE, /score strobe or admit steady/);
});

test("has-repro fingerprints encode the published interactive window", () => {
  const result = handle(readData("strobing.json"));
  assert.equal(result.published.claudeCodeVersion, "2.1.267");
  assert.equal(result.published.author, "lanej");
  assert.equal(result.published.sessionKind, "interactive");
  assert.equal(result.published.terminal, "tmux");
  assert.equal(result.published.banner, BANNER);
  assert.equal(result.published.prompt, PROMPT);
  assert.match(
    fingerprint(seedStrobing()),
    /strobing\|loop=never\|wakeup=off-label\|banner=painted\|skills=1\|prompt=redelivered\|cue=strobing/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes recent catalog words including Counterfoil and Lucida", () => {
  const required = [
    "matched",
    "skewed",
    "headers-hash",
    "counterfoil",
    "traced",
    "pathless",
    "image-cache",
    "lucida",
    "scrubbed",
    "contaminated",
    "fomite",
    "gitignore",
    "damped",
    "spinning",
    "mux",
    "snubber",
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
    "bound",
    "accreted",
    "session-url",
    "cartulary",
    "sealed",
    "mismatched",
    "issuer",
    "paraph",
    "routed",
    "inherited",
    "cascade",
    "appanage",
    "afloat",
    "pontoon",
    "concordant",
    "reaped",
    "revenant",
    "oubliette",
    "vernier",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("steady rail flips strobing back when ScheduleWakeup stays unused outside /loop", () => {
  const tape = {
    steady: true,
    neverLoop: true,
    loopInvoked: false,
    scheduleWakeup: false,
    offLabel: false,
    loopBanner: false,
    skillsTruncated: false,
    promptRedelivered: false,
    strobing: false,
    cue: "steady",
  };
  assert.equal(scoreGate(tape).verdict, "steady");
  tape.steady = false;
  tape.strobing = true;
  tape.scheduleWakeup = true;
  tape.offLabel = true;
  tape.loopBanner = true;
  tape.cue = "strobing";
  assert.equal(scoreGate(tape).verdict, "strobing");
  tape.steady = true;
  tape.strobing = false;
  tape.scheduleWakeup = false;
  tape.offLabel = false;
  tape.loopBanner = false;
  tape.cue = "steady";
  assert.equal(scoreGate(tape).verdict, "steady");
});

test("loop, wakeup, banner, skills, and rail mark strobing after off-label discharge", () => {
  const idle = inspectLoop({ neverLoop: true, loopInvoked: false, steady: true });
  assert.equal(idle.stamp, "steady");
  assert.equal(idle.never, true);
  const wakeup = inspectWakeup({
    scheduleWakeup: true,
    offLabel: true,
    neverLoop: true,
  });
  assert.equal(wakeup.stamp, "strobing");
  assert.equal(wakeup.offLabel, true);
  const banner = inspectBanner({
    loopBanner: true,
    scheduleWakeup: true,
    neverLoop: true,
  });
  assert.equal(banner.stamp, "strobing");
  assert.equal(banner.text, BANNER);
  const skills = inspectSkills({
    skillsTruncated: true,
    oneSkill: true,
    skillsCount: 1,
  });
  assert.equal(skills.stamp, "strobing");
  assert.equal(skills.count, 1);
  const prompt = inspectPrompt({ promptRedelivered: true });
  assert.equal(prompt.stamp, "strobing");
  assert.equal(prompt.text, PROMPT);
  const desk = readRail({
    strobing: true,
    scheduleWakeup: true,
    offLabel: true,
    neverLoop: true,
    loopBanner: true,
  });
  assert.equal(desk.strobing, true);
  assert.equal(desk.mark, "strobing");
  const calm = readRail({
    steady: true,
    neverLoop: true,
    strobing: false,
  });
  assert.equal(calm.strobing, false);
  assert.equal(calm.mark, "steady");
});

test("cousins are cite-only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 7);
  assert.equal(COUSINS[0].issue, 88205);
  assert.equal(COUSINS[1].issue, 82634);
  assert.equal(COUSINS[2].issue, 86245);
  assert.equal(COUSINS[3].issue, 74569);
  assert.equal(COUSINS[4].issue, 82633);
  assert.equal(COUSINS[5].issue, 77235);
  assert.equal(COUSINS[6].issue, 93114);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("counterfoil"));
  assert.ok(NOT_PRODUCTS.includes("lucida"));
  assert.ok(NOT_PRODUCTS.includes("flashpan"));
  assert.ok(NOT_PRODUCTS.includes("mirage"));
  assert.ok(NOT_PRODUCTS.includes("glowplug"));
  assert.ok(NOT_PRODUCTS.includes("deadlight"));
  assert.ok(NOT_PRODUCTS.includes("ukase"));
  assert.ok(NOT_PRODUCTS.includes("almanac"));
  assert.ok(NOT_PRODUCTS.includes("stroboscope"));
  assert.equal(BACKUPS.length, 5);
  assert.equal(BACKUPS[0].issue, 93458);
  assert.equal(BACKUPS[1].issue, 93439);
  assert.equal(BACKUPS[2].issue, 93475);
  assert.equal(BACKUPS[3].issue, 93438);
  assert.equal(BACKUPS[4].issue, 93466);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/strobing.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(JSON.parse(idle.stdout).verdict, "steady");
  assert.equal(JSON.parse(seeded.stdout).verdict, "strobing");
});

test("handle exposes published hypothesis and #93468 headline", () => {
  const result = handle(readData("strobing.json"));
  assert.equal(result.published.issue, 93468);
  assert.equal(result.published.claudeCodeVersion, "2.1.267");
  assert.equal(result.published.author, "lanej");
  assert.deepEqual(result.published.cousins, [
    88205, 82634, 86245, 74569, 82633, 77235, 93114,
  ]);
  assert.ok(result.published.backups.includes(93458));
  assert.ok(result.published.backups.includes(93439));
  assert.ok(result.published.backups.includes(93466));
  assert.match(result.published.hypothesis, /loop-mode flags/);
  assert.match(result.published.hypothesis, /NON-BINDING/);
});

test("model has no static node: imports so the living page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("living page is a hangar strobe-beacon booth, not a cheque counterfoil or camera lucida", () => {
  const page = readPage();
  assert.match(page, /Newsreader/);
  assert.match(page, /Figtree/);
  assert.match(page, /Red Hat Mono/);
  assert.match(page, /strobe|hangar|beacon|capacitor|flash/i);
  assert.match(page, /#0b1220|#3de0ff|#f0b429|#7c5cff|#e11d48/);
  assert.match(page, /steady/);
  assert.match(page, /strobing/);
  assert.match(page, /off-label/);
  assert.match(page, /score strobe or admit steady/i);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /06:50/);
  assert.match(page, /#279/);
  assert.match(page, /#93468/);
  assert.match(page, /lanej/);
  assert.match(page, /2\.1\.267/);
  assert.match(page, /2\.1\.257/);
  assert.match(page, /ScheduleWakeup/);
  assert.match(page, /subagent-driven-development/);
  assert.match(page, /Claude resuming \/loop wakeup/);
  assert.match(page, /1 skill available/);
  assert.match(page, /Arm the beacon/);
  assert.match(page, /Score strobe/);
  assert.match(page, /Kill the flash/);
  assert.match(page, /Audit skills list/);
  assert.match(page, /Pin idle steady/);
  assert.match(page, /Pin seeded strobing/);
  assert.match(page, /Pin off-label/);
  assert.match(page, /Clear the rail/);
  assert.doesNotMatch(page, /Libre Baskerville/);
  assert.doesNotMatch(page, /Source Sans 3/);
  assert.doesNotMatch(page, /JetBrains Mono/);
  assert.doesNotMatch(page, /Fraunces/);
  assert.doesNotMatch(page, /Plus Jakarta/);
  assert.doesNotMatch(page, /IBM Plex Mono/);
  assert.doesNotMatch(page, /Cormorant/);
  assert.doesNotMatch(page, /Outfit/);
  assert.doesNotMatch(page, /Space Mono/);
  assert.doesNotMatch(page, /Source Serif 4/);
  assert.doesNotMatch(page, /Libre Franklin/);
  assert.doesNotMatch(page, /Noto Sans Mono/);
  assert.doesNotMatch(page, /Alegreya/);
  assert.doesNotMatch(page, /#0d3b2e/);
  assert.doesNotMatch(page, /#f4efe6/);
  assert.doesNotMatch(page, /#f7f0e4/);
  assert.doesNotMatch(page, /#5c4d8a/);
  assert.doesNotMatch(page, /flintlock flashpan|desert mirage|diesel glowplug|deadlight porthole|imperial ukase|cheque-counter|camera-lucida atelier|culture dish|pulse-damper|earthwork fosse/i);
  assert.doesNotMatch(page, /\bmatched\b/);
  assert.doesNotMatch(page, /\bskewed\b/);
  assert.doesNotMatch(page, /\btraced\b/);
  assert.doesNotMatch(page, /\bpathless\b/);
  assert.doesNotMatch(page, /\baccreted\b/);
  assert.match(page, /NOT Flashpan/i);
  assert.match(page, /NOT Mirage/i);
  assert.match(page, /NOT Glowplug/i);
  assert.match(page, /NOT Deadlight/i);
  assert.match(page, /NOT Ukase/i);
  assert.match(page, /NOT Almanac/i);
  assert.match(page, /NOT Counterfoil/i);
  assert.match(page, /NOT Lucida/i);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Strobe/);
  assert.match(readme, /#93468/);
  assert.match(readme, /steady/);
  assert.match(readme, /strobing/);
  assert.match(readme, /off-label/);
  assert.match(readme, /Newsreader/);
  assert.match(readme, /Figtree/);
  assert.match(readme, /Red Hat Mono/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /NOT Flashpan/i);
  assert.match(readme, /NOT Mirage/i);
  assert.match(readme, /NOT Glowplug/i);
  assert.match(readme, /NOT Deadlight/i);
  assert.match(readme, /NOT Ukase/i);
  assert.match(readme, /NOT Almanac/i);
  assert.match(readme, /NOT Counterfoil/i);
  assert.match(readme, /NOT Lucida/i);
  assert.match(readme, /2\.1\.267/);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/strobe/);
  assert.match(readme, /node --test projects\/strobe\/strobe\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /loop-mode flags/);
  assert.match(readme, /#88205/);
  assert.match(readme, /#82634/);
  assert.match(readme, /#86245/);
  assert.match(readme, /hangar/);
  assert.match(readme, /ScheduleWakeup/);
});

test("catalog features Strobe only; Counterfoil and Lucida unfeatured", () => {
  const catalog = readCatalog();
  assert.equal(catalog.products.length, 279);
  assert.equal(catalog.products[0].name, "Strobe");
  assert.equal(catalog.products[0].slug, "strobe");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/strobe/");
  assert.equal(catalog.products[0].day, "2026-09-11");
  assert.match(catalog.products[0].summary, /06:50/);
  assert.match(catalog.products[0].summary, /strobe/);
  assert.match(catalog.products[0].summary, /#93468/);
  assert.match(catalog.products[0].summary, /steady/);
  assert.match(catalog.products[0].summary, /strobing/);
  assert.match(catalog.products[0].summary, /off-label/);
  const counterfoil = catalog.products.find((row) => row.slug === "counterfoil");
  assert.ok(counterfoil);
  assert.equal(counterfoil.featured, false);
  const lucida = catalog.products.find((row) => row.slug === "lucida");
  assert.ok(lucida);
  assert.equal(lucida.featured, false);
  const fomite = catalog.products.find((row) => row.slug === "fomite");
  assert.ok(fomite);
  assert.equal(fomite.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "strobe").length, 1);
  assert.ok(!catalog.products.some((row) => String(row.summary || "").includes("93468") && row.slug !== "strobe"));
});

test("vercel rewrites strobe to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/strobe");
  assert.equal(vercel.rewrites[0].destination, "/projects/strobe");
  assert.equal(vercel.rewrites[1].source, "/strobe/");
  assert.equal(vercel.rewrites[1].destination, "/projects/strobe");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /\bcurl\b/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});
