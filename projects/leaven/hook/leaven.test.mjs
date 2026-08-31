import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM_VERDICTS,
  AUTHOR,
  BLANK_QUOTE,
  CHIPS,
  CONTAMINATED_DURATION,
  FAILED_OF_ABOUT,
  FEATURED_ISSUE,
  FILED_AT,
  HARNESS_TOKEN,
  HEALTHY_DURATION,
  HEALTHY_TOOLS,
  HOLD_VERDICTS,
  IDLE_WORD,
  LABELS,
  MODEL,
  NEARBY_BOUNDARY,
  NOTION_QUOTE,
  OS,
  PRIMARY_ISSUES,
  SAME_CLASS,
  SEED_ALIASES,
  SKILL_QUOTE,
  SPANISH_QUOTE,
  TITLE,
  VERDICTS,
  VERSION,
  analyze,
  chipsOf,
  classify,
  decide,
  decideSeed,
  handle,
  isLeavenedSignature,
  isUnleavenedBake,
  score,
  seedBlankAbort,
  seedContaminated,
  seedForeignEcho,
  seedLeavened,
  seedMcpEcho,
  seedRelaunchedClean,
  seedSkillEcho,
  seedSpanishSkill,
  seedSystemDebris,
  seedUnleavened,
  seedZeroTool,
} from "./leaven.mjs";

function readData(name) {
  return JSON.parse(readFileSync(fileURLToPath(new URL(`../data/${name}`, import.meta.url)), "utf8"));
}

function readPage() {
  return readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
}

test("90782 seed is leavened/alarm — 0 tools, 2–12s, instruction-shaped foreign echo", () => {
  const seed = seedLeavened();
  const result = score(seed);
  assert.equal(result.verdict, "leavened");
  assert.equal(result.leavened, true);
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.equal(result.unleavened, false);
  assert.equal(result.idleWord, "unleavened");
  assert.equal(IDLE_WORD, "unleavened");
  assert.doesNotMatch(result.idleWord, /leaven$/i);
  assert.equal(result.issue, FEATURED_ISSUE);
  assert.equal(seed.toolUses, 0);
  assert.equal(seed.durationSeconds, 12);
  assert.equal(seed.instructionShaped, true);
  assert.equal(seed.mcpMentionedInPrompt, false);
  assert.equal(seed.outputText, NOTION_QUOTE);
  assert.equal(analyze(seed).leavenedPattern, true);
  assert.equal(isLeavenedSignature(seed), true);
  assert.ok(result.chips.includes("leavened"));
  assert.ok(result.chips.includes("zero-tool"));
  assert.ok(result.chips.includes("foreign-echo"));
  assert.ok(!result.chips.includes("unleavened"));
});

test("unleavened seed is unleavened/hold — tools, healthy band, task-shaped, no debris", () => {
  const seed = seedUnleavened();
  const result = score(seed);
  assert.equal(result.verdict, "unleavened");
  assert.equal(result.unleavened, true);
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.idleWord, "unleavened");
  assert.equal(seed.toolUses, 10);
  assert.equal(seed.durationSeconds, 90);
  assert.equal(seed.instructionShaped, false);
  assert.equal(isUnleavenedBake(seed), true);
  assert.ok(result.chips.includes("unleavened"));
});

test("decideSeed covers every named verdict", () => {
  for (const name of VERDICTS) {
    const result = decideSeed(name);
    assert.equal(result.verdict, name, name);
    assert.equal(result.idleWord, "unleavened");
    assert.doesNotMatch(result.idleWord, /^leaven$/i);
  }
  assert.equal(decide({ action: "90782" }).verdict, "leavened");
  assert.equal(decide({ action: "leavened" }).verdict, "leavened");
  assert.equal(decide({ action: "unleavened" }).verdict, "unleavened");
  assert.equal(decide({ action: "spanish-skill" }).verdict, SEED_ALIASES["spanish-skill"]);
  assert.equal(decide({ action: "notion-mcp" }).verdict, SEED_ALIASES["notion-mcp"]);
});

test("rule: 0 tools + seconds-long + instruction-shaped is alarm", () => {
  const ticket = {
    toolUses: 0,
    durationSeconds: 12,
    instructionShaped: true,
    outputText: NOTION_QUOTE,
    mcpMentionedInPrompt: false,
  };
  const result = score(ticket);
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.ok(ALARM_VERDICTS.includes(result.verdict));
  assert.equal(isLeavenedSignature(ticket), true);
});

test("rule: tools + healthy band + task-shaped + no debris is unleavened", () => {
  const ticket = {
    toolUses: 10,
    durationSeconds: 90,
    instructionShaped: false,
    outputText: "Explored the tree. Notes from Explore: files listed.",
    debrisFingerprints: [],
  };
  assert.equal(classify(ticket), "unleavened");
  assert.equal(score(ticket).hold, true);
});

test("specific alarm classes from the five occurrences", () => {
  assert.equal(score(seedMcpEcho()).verdict, "mcp-echo");
  assert.equal(score(seedSpanishSkill()).verdict, "skill-echo");
  assert.equal(score(seedSystemDebris()).verdict, "system-debris");
  assert.equal(score(seedBlankAbort()).verdict, "blank-abort");
  assert.equal(score(seedSkillEcho()).verdict, "skill-echo");
  assert.equal(score(seedContaminated()).verdict, "contaminated");
  assert.equal(score(seedForeignEcho()).verdict, "foreign-echo");
  assert.equal(score(seedZeroTool()).verdict, "zero-tool");
  assert.equal(score(seedRelaunchedClean()).verdict, "relaunched-clean");
  assert.ok(chipsOf(seedSystemDebris()).includes("system-debris"));
  assert.ok(chipsOf(seedMcpEcho()).includes("notion-mcp"));
  assert.ok(chipsOf(seedSpanishSkill()).includes("spanish-skill"));
  assert.ok(chipsOf(seedBlankAbort()).includes("blank-abort"));
  assert.match(seedSystemDebris().outputText, /_bump_bwrap_repro/);
});

test("local fingerprint files keep issue numbers and #90782 facts only", () => {
  const primary = readData("90782.json");
  const hold = readData("unleavened.json");
  const notion = readData("notion-mcp.json");
  const spanish = readData("spanish-skill.json");
  const debris = readData("system-debris.json");
  const blank = readData("blank-abort.json");
  const skill = readData("skill-echo.json");
  const prints = readData("fingerprints.json");
  const chips = readData("chips.json");
  assert.equal(primary.issue, 90782);
  assert.equal(primary.toolUses, 0);
  assert.equal(primary.durationSeconds, 12);
  assert.equal(primary.instructionShaped, true);
  assert.equal(score(primary).verdict, "leavened");
  assert.equal(hold.issue, 90782);
  assert.equal(score(hold).verdict, "unleavened");
  assert.equal(score(notion).verdict, "mcp-echo");
  assert.equal(score(spanish).verdict, "skill-echo");
  assert.equal(score(debris).verdict, "system-debris");
  assert.equal(score(blank).verdict, "blank-abort");
  assert.equal(score(skill).verdict, "skill-echo");
  assert.match(debris.outputText, /_bump_bwrap_repro/);
  assert.equal(prints.primary[0].issue, 90782);
  assert.equal(prints.idleWord, "unleavened");
  assert.deepEqual(
    prints.primary.map((row) => row.issue),
    [...PRIMARY_ISSUES],
  );
  assert.deepEqual(
    prints.sameClass.map((row) => row.issue),
    [...SAME_CLASS],
  );
  assert.equal(AUTHOR, "Beppo90");
  assert.equal(FILED_AT, "2026-08-30T15:29:59Z");
  assert.equal(TITLE, primary.title);
  assert.deepEqual([...LABELS], ["bug", "has repro", "platform:macos", "area:agents"]);
  assert.equal(FAILED_OF_ABOUT.failed, 5);
  assert.equal(FAILED_OF_ABOUT.about, 20);
  assert.equal(CONTAMINATED_DURATION.min, 2);
  assert.equal(CONTAMINATED_DURATION.max, 12);
  assert.equal(HEALTHY_DURATION.min, 90);
  assert.equal(HEALTHY_DURATION.max, 220);
  assert.equal(HEALTHY_TOOLS.min, 10);
  assert.equal(HEALTHY_TOOLS.max, 20);
  assert.ok(Array.isArray(chips.seeds));
  for (const name of ALARM_VERDICTS) {
    assert.ok(
      chips.seeds.some((row) => row.seed === name),
      name,
    );
  }
});

test("handle alarms on leavened and allows unleavened", async () => {
  const fail = await handle(seedLeavened());
  assert.equal(fail.hook_event_name, "Stop");
  assert.match(fail.hookSpecificOutput.additionalContext, /#90782/);
  assert.equal(fail.alarm, true);
  const hold = await handle(seedUnleavened());
  assert.equal(hold.unleavened, true);
  assert.match(hold.hookSpecificOutput.additionalContext, /unleavened/i);
});

test("verdict and chip lists; idle is never leaven", () => {
  assert.deepEqual(VERDICTS, [
    "unleavened",
    "leavened",
    "contaminated",
    "foreign-echo",
    "zero-tool",
    "system-debris",
    "mcp-echo",
    "skill-echo",
    "blank-abort",
    "relaunched-clean",
  ]);
  assert.ok(CHIPS.includes("spanish-skill"));
  assert.ok(CHIPS.includes("notion-mcp"));
  assert.ok(HOLD_VERDICTS.includes("unleavened"));
  assert.ok(!HOLD_VERDICTS.includes("leaven"));
  assert.doesNotMatch(IDLE_WORD, /^leaven$/i);
  assert.equal(SEED_ALIASES["spanish-skill"], "skill-echo");
  assert.equal(SEED_ALIASES["notion-mcp"], "mcp-echo");
  assert.equal(MODEL, "claude-fable-5");
  assert.equal(OS, "darwin 25.5.0");
  assert.equal(VERSION, "darwin 25.5.0");
  assert.deepEqual([...NEARBY_BOUNDARY], [90544]);
  assert.equal(NOTION_QUOTE.includes("search tools"), true);
  assert.equal(SPANISH_QUOTE.includes("empezá"), true);
  assert.equal(SKILL_QUOTE.includes("directly relevant"), true);
  assert.equal(BLANK_QUOTE.includes("left blank intentionally"), true);
  assert.equal(HARNESS_TOKEN, "_bump_bwrap_repro");
});

test("living page seeds leavened and names unleavened idle", () => {
  const html = readPage();
  assert.match(html, /leavened/);
  assert.match(html, /unleavened/);
  assert.match(html, /Idle word:\s*unleavened/);
  assert.match(html, /contaminated/);
  assert.match(html, /foreign-echo/);
  assert.match(html, /zero-tool/);
  assert.match(html, /system-debris/);
  assert.match(html, /mcp-echo/);
  assert.match(html, /skill-echo/);
  assert.match(html, /blank-abort/);
  assert.match(html, /relaunched-clean/);
  assert.match(html, /spanish-skill/);
  assert.match(html, /notion-mcp/);
  assert.match(html, /#90782/);
  assert.match(html, /#90765/);
  assert.match(html, /09:50 Sydney · leaven/);
  assert.match(html, /Newsreader/);
  assert.match(html, /Karla/);
  assert.match(html, /Source Code Pro/);
  assert.match(html, /_bump_bwrap_repro/);
  assert.match(html, /Toda tarea creativa/);
  assert.match(html, /For EVERY user request/);
  assert.match(html, /left blank intentionally/);
  assert.match(html, /VRUC-2/);
  assert.match(html, /darwin 25\.5\.0/);
  assert.match(html, /claude-fable-5/);
  assert.doesNotMatch(html, /Idle word:\s*leaven/i);
  assert.doesNotMatch(html, /family=Libre\+Baskerville/);
  assert.doesNotMatch(html, /family=DM\+Sans/);
  assert.doesNotMatch(html, /JetBrains Mono/);
  assert.doesNotMatch(html, /millimetre/);
  assert.doesNotMatch(html, /marble registry/);
  assert.doesNotMatch(html, /bronze fountain/);
  assert.doesNotMatch(html, /twin ledgers/);
});
