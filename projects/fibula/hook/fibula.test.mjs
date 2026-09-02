import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ADDON,
  ADDON_BUNDLE,
  ALARM_VERDICTS,
  ARCH,
  BANNED_NAMES,
  BUILD_TIME,
  CHIPS,
  CONTRAST_NOTE,
  COPY_PATH,
  COUSINS,
  COUSIN_ISSUE,
  CROSS_ECOSYSTEM,
  DISPLAY_HANG,
  DISPLAY_RE,
  DISPLAY_REFUSED,
  FEATURED_ISSUE,
  FILED_AT,
  FORBIDDEN_IDLE,
  FORBIDDEN_UI,
  GIT_SHA,
  HOLD_VERDICTS,
  HUB_LINE,
  HYPOTHESIS_NOTE,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  MARK,
  NOT_PRODUCTS,
  PHRASE,
  PLATFORM,
  PRIMARY_ISSUES,
  PROBE_ORDER,
  REPORTER,
  SEEDED_WORD,
  TERM_PROGRAM,
  TITLE,
  TUI_SETTING,
  VERDICTS,
  VERSION,
  VERSION_219,
  VERSION_231,
  VSCODE,
  WCHAN,
  WORKAROUNDS,
  X_SOCKET,
  analyze,
  chipsOf,
  classify,
  decide,
  decideSeed,
  emptyTicket,
  handle,
  isClasped,
  isSprung,
  normalize,
  score,
  seedClasped,
  seedClipboardNapiSync,
  seedCousin,
  seedDisplayHang,
  seedDragSelectFreeze,
  seedEventLoopStuck,
  seedHasRepro,
  seedHold,
  seedKillOnlyEscape,
  seedNoOsc52Fallback,
  seedNoTimeout,
  seedSprung,
  seedXSocketMute,
} from "./fibula.mjs";

function readData(name) {
  return JSON.parse(
    readFileSync(fileURLToPath(new URL(`../data/${name}`, import.meta.url)), "utf8"),
  );
}

function readPage() {
  return readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
}

function readReadme() {
  return readFileSync(fileURLToPath(new URL("../README.md", import.meta.url)), "utf8");
}

function hookPath() {
  return fileURLToPath(new URL("./fibula.mjs", import.meta.url));
}

test("fail-fast OSC 52 + responsive TUI → sprung", () => {
  const result = analyze({
    display: "",
    displaySet: false,
    muteXSocket: false,
    addonSync: false,
    noTimeout: false,
    osc52Emitted: true,
    tuiResponsive: true,
    escapeWorks: true,
    eventLoopStuck: false,
    dragSelect: true,
    fullscreen: true,
    killOnly: false,
  });
  assert.equal(result.verdict, "sprung");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.clasped, false);
  assert.equal(result.sprung, true);
  assert.equal(isSprung(result.ticket), true);
  assert.equal(isClasped(result.ticket), false);
});

test("mute DISPLAY + sync addon + no OSC 52 + stuck poll → clasped", () => {
  const result = analyze({
    display: ":20",
    displaySet: true,
    muteXSocket: true,
    addonSync: true,
    noTimeout: true,
    osc52Emitted: false,
    tuiResponsive: false,
    escapeWorks: false,
    eventLoopStuck: true,
    wchan: "do_sys_poll",
    dragSelect: true,
    fullscreen: true,
    killOnly: true,
  });
  assert.equal(result.verdict, "clasped");
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.equal(result.clasped, true);
  assert.equal(isClasped(result.ticket), true);
  assert.ok(result.chips.includes("clasped"));
  assert.ok(result.chips.includes("display-hang"));
  assert.ok(result.chips.includes("clipboard-napi-sync"));
  assert.ok(!result.chips.includes("sprung"));
});

test("idle sprung is a hold; clipboard fails fast or uses OSC 52", () => {
  const result = analyze(seedSprung());
  assert.equal(result.verdict, "sprung");
  assert.equal(result.idleWord, "sprung");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.clasped, false);
  assert.equal(result.sprung, true);
  assert.ok(result.chips.includes("sprung"));
  assert.ok(result.chips.includes("hold"));
  assert.ok(!result.chips.includes("clasped"));
  assert.equal(result.ticket.osc52Emitted, true);
  assert.equal(result.ticket.tuiResponsive, true);
  assert.equal(result.ticket.eventLoopStuck, false);
  assert.match(result.contrast.case, /sprung/i);
  assert.doesNotMatch(
    result.idleWord,
    /clasped|literal|jammed|sifted|stocked|aired|drained|hinged|pealed|warded|first-wins|seized|pooled|cased/i,
  );
});

test("empty ticket and empty stdin classify sprung", () => {
  assert.equal(classify(emptyTicket()), "sprung");
  assert.equal(classify(""), "sprung");
  assert.equal(classify(null), "sprung");
  assert.equal(decideSeed("sprung").verdict, "sprung");
  assert.equal(decideSeed("open").verdict, "sprung");
});

test("seeded clasped #91306 is alarm with mute DISPLAY, no timeout, no OSC 52", () => {
  const result = analyze(seedClasped());
  assert.equal(result.verdict, "clasped");
  assert.equal(result.alarm, true);
  assert.equal(result.hold, false);
  assert.equal(result.clasped, true);
  assert.ok(result.chips.includes("clasped"));
  assert.ok(result.chips.includes("display-hang"));
  assert.ok(result.chips.includes("clipboard-napi-sync"));
  assert.ok(result.chips.includes("no-timeout"));
  assert.ok(result.chips.includes("x-socket-mute"));
  assert.ok(result.chips.includes("drag-select-freeze"));
  assert.ok(result.chips.includes("no-osc52-fallback"));
  assert.ok(result.chips.includes("kill-only-escape"));
  assert.ok(result.chips.includes("event-loop-stuck"));
  assert.ok(result.chips.includes("has-repro"));
  assert.ok(!result.chips.includes("sprung"));
  assert.match(result.contrast.case, /clasped/i);
  assert.equal(result.ticket.display, DISPLAY_HANG);
  assert.equal(result.ticket.wchan, WCHAN);
  assert.equal(result.ticket.version, VERSION);
  assert.equal(result.ticket.buildTime, BUILD_TIME);
  assert.equal(result.ticket.gitSha, GIT_SHA);
});

test("data fixtures classify sprung vs clasped vs named chips", () => {
  assert.equal(classify(readData("sprung.json")), "sprung");
  assert.equal(classify(readData("clasped.json")), "clasped");
  assert.equal(classify(readData("91306.json")), "clasped");
  assert.equal(classify(readData("display-hang.json")), "display-hang");
  assert.equal(classify(readData("clipboard-napi-sync.json")), "clipboard-napi-sync");
  assert.equal(classify(readData("no-timeout.json")), "no-timeout");
  assert.equal(classify(readData("x-socket-mute.json")), "x-socket-mute");
  assert.equal(classify(readData("drag-select-freeze.json")), "drag-select-freeze");
  assert.equal(classify(readData("no-osc52-fallback.json")), "no-osc52-fallback");
  assert.equal(classify(readData("kill-only-escape.json")), "kill-only-escape");
  assert.equal(classify(readData("event-loop-stuck.json")), "event-loop-stuck");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("hold.json")), "hold");
});

test("clasped seed is alarm; sprung / hold are holds", () => {
  assert.equal(score(seedClasped()).alarm, true);
  assert.equal(score(seedClasped()).hold, false);
  assert.equal(score(seedSprung()).hold, true);
  assert.equal(score(seedSprung()).alarm, false);
  assert.equal(score(seedHold()).hold, true);
  assert.equal(score(seedDisplayHang()).alarm, true);
  assert.equal(score(seedClipboardNapiSync()).alarm, true);
});

test("normalize seeds 91306 without ticket fields", () => {
  const ticket = normalize({ issue: 91306 });
  assert.equal(ticket.addonSync, true);
  assert.equal(ticket.noTimeout, true);
  assert.equal(ticket.osc52Emitted, false);
  assert.equal(ticket.eventLoopStuck, true);
  assert.equal(ticket.killOnly, true);
  assert.equal(ticket.display, DISPLAY_HANG);
  assert.equal(ticket.wchan, WCHAN);
  assert.equal(classify(ticket), "clasped");
});

test("score / decide / handle agree on clasped vs sprung", () => {
  assert.equal(score(seedClasped()).verdict, "clasped");
  assert.equal(decide(seedSprung()).verdict, "sprung");
  const fail = handle(seedClasped());
  const hold = handle(seedSprung());
  const working = handle(seedHold());
  assert.match(fail.hookSpecificOutput.additionalContext, /#91306/);
  assert.match(fail.hookSpecificOutput.additionalContext, /setLinuxClipboardText/);
  assert.match(hold.hookSpecificOutput.additionalContext, /sprung/i);
  assert.match(working.hookSpecificOutput.additionalContext, /hold/i);
});

test("decideSeed aliases", () => {
  assert.equal(decideSeed("clasped").verdict, "clasped");
  assert.equal(decideSeed(91306).verdict, "clasped");
  assert.equal(decideSeed("91306").verdict, "clasped");
  assert.equal(decideSeed("sprung").verdict, "sprung");
  assert.equal(decideSeed("hold").verdict, "hold");
  assert.equal(decideSeed("display-hang").verdict, "display-hang");
  assert.equal(decideSeed("clipboard-napi-sync").verdict, "clipboard-napi-sync");
  assert.equal(decideSeed("no-timeout").verdict, "no-timeout");
  assert.equal(decideSeed("event-loop-stuck").verdict, "event-loop-stuck");
});

test("CLI scores data files", () => {
  const clasped = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/91306.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(clasped.status, 0, clasped.stderr);
  assert.equal(JSON.parse(clasped.stdout).verdict, "clasped");
  assert.equal(JSON.parse(clasped.stdout).alarm, true);

  const sprung = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/sprung.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(sprung.status, 0, sprung.stderr);
  assert.equal(JSON.parse(sprung.stdout).verdict, "sprung");
  assert.equal(JSON.parse(sprung.stdout).hold, true);

  const hold = spawnSync(
    process.execPath,
    [hookPath(), fileURLToPath(new URL("../data/hold.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(hold.status, 0, hold.stderr);
  assert.equal(JSON.parse(hold.stdout).verdict, "hold");
});

test("constants match the issue facts only", () => {
  assert.equal(FEATURED_ISSUE, 91306);
  assert.deepEqual([...PRIMARY_ISSUES], [91306]);
  assert.equal(COUSIN_ISSUE, 61936);
  assert.deepEqual(
    [...COUSINS],
    [61936, 72173, 89097, 74214, 88898, 80330, 88779],
  );
  assert.deepEqual([...CROSS_ECOSYSTEM], ["openai/codex#33968"]);
  assert.equal(FILED_AT, "2026-09-01T19:42:48Z");
  assert.equal(VERSION, "2.1.257");
  assert.equal(VERSION_219, "2.1.219");
  assert.equal(VERSION_231, "2.1.231");
  assert.equal(BUILD_TIME, "2026-09-01T05:28:54Z");
  assert.equal(GIT_SHA, "2c673eef");
  assert.equal(PLATFORM, "linux");
  assert.equal(ARCH, "x64");
  assert.equal(VSCODE, "1.134.0");
  assert.equal(TERM_PROGRAM, "vscode");
  assert.equal(TUI_SETTING, "fullscreen");
  assert.equal(DISPLAY_HANG, ":20");
  assert.equal(DISPLAY_REFUSED, ":0");
  assert.equal(WCHAN, "do_sys_poll");
  assert.equal(ADDON, "setLinuxClipboardText");
  assert.equal(ADDON_BUNDLE, "clipboard-napi");
  assert.equal(COPY_PATH, "copySelectionNoClear -> setClipboard -> native Linux copy");
  assert.deepEqual([...PROBE_ORDER], ["wl-copy", "xclip", "xsel", "addon"]);
  assert.equal(DISPLAY_RE, "^(unix)?:");
  assert.equal(X_SOCKET, "/tmp/.X11-unix/X");
  assert.deepEqual(
    [...WORKAROUNDS],
    ["unset DISPLAY", "CLAUDE_CODE_DISABLE_MOUSE=1", "/tui default"],
  );
  assert.equal(REPORTER, "Legonois");
  assert.equal(IDLE_WORD, "sprung");
  assert.equal(SEEDED_WORD, "clasped");
  assert.notEqual(IDLE_WORD, "clasped");
  assert.notEqual(IDLE_WORD, "literal");
  assert.notEqual(IDLE_WORD, "jammed");
  assert.notEqual(IDLE_WORD, "sifted");
  assert.notEqual(IDLE_WORD, "stocked");
  assert.notEqual(IDLE_WORD, "aired");
  assert.notEqual(IDLE_WORD, "drained");
  assert.notEqual(IDLE_WORD, "hinged");
  assert.notEqual(IDLE_WORD, "pealed");
  assert.notEqual(IDLE_WORD, "warded");
  assert.notEqual(IDLE_WORD, "first-wins");
  assert.notEqual(IDLE_WORD, "seized");
  assert.notEqual(IDLE_WORD, "pooled");
  assert.notEqual(IDLE_WORD, "cased");
  assert.deepEqual([...HOLD_VERDICTS], ["sprung", "hold"]);
  assert.ok(ALARM_VERDICTS.includes("clasped"));
  assert.ok(ALARM_VERDICTS.includes("display-hang"));
  assert.ok(ALARM_VERDICTS.includes("no-timeout"));
  assert.ok(!ALARM_VERDICTS.includes("sprung"));
  assert.deepEqual([...VERDICTS], [...CHIPS]);
  assert.equal(VERDICTS.length, 12);
  assert.deepEqual(
    [...LABELS],
    ["bug", "has repro", "platform:linux", "area:tui", "platform:vscode"],
  );
  assert.match(TITLE, /Fullscreen drag-select blocks TUI/);
  assert.match(ISSUE_URL, /91306/);
  assert.match(PHRASE, /clasps on a mute DISPLAY/i);
  assert.match(HUB_LINE, /09:50 fibula/);
  assert.match(HUB_LINE, /admit sprung/);
  assert.match(MARK, /09:50/);
  assert.match(MARK, /#110/);
  assert.match(MARK, /#91306/);
  assert.match(CONTRAST_NOTE, /FULLSCREEN DRAG-SELECT → SYNC clipboard-napi setLinuxClipboardText HANG/);
  assert.match(HYPOTHESIS_NOTE, /NON-BINDING/);
  assert.ok(NOT_PRODUCTS.includes("virgule"));
  assert.ok(NOT_PRODUCTS.includes("riddle"));
  assert.ok(NOT_PRODUCTS.includes("garner"));
  assert.ok(NOT_PRODUCTS.includes("pintle"));
  assert.ok(BANNED_NAMES.includes("Clipboard"));
  assert.ok(BANNED_NAMES.includes("Virgule"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(IDLE_WORD, word);
  }
});

test("chips.json and fingerprints stay aligned", () => {
  const chips = readData("chips.json");
  assert.deepEqual(chips.verdicts, [...VERDICTS]);
  assert.equal(chips.idleWord, "sprung");
  assert.equal(chips.seededWord, "clasped");
  const fp = readData("fingerprints.json");
  assert.equal(fp.primary, 91306);
  assert.equal(fp.cousin, 61936);
  assert.deepEqual(fp.cousins, [61936, 72173, 89097, 74214, 88898, 80330, 88779]);
  assert.equal(fp.version, "2.1.257");
  assert.equal(fp.version219, "2.1.219");
  assert.equal(fp.version231, "2.1.231");
  assert.equal(fp.displayHang, ":20");
  assert.equal(fp.wchan, "do_sys_poll");
  assert.equal(fp.addon, "setLinuxClipboardText");
  const fixtures = readData("fixtures.json");
  assert.equal(fixtures.rows.length, 5);
  assert.equal(fixtures.rows[0].verdict, "clasped");
  assert.equal(fixtures.narrativeNotFixture.noCountsInvented, true);
  assert.equal(fixtures.narrativeNotFixture.setLinuxClipboardText, true);
});

test("chipsOf on a raw mute-DISPLAY ticket still marks clasped", () => {
  const chips = chipsOf({
    display: ":20",
    displaySet: true,
    muteXSocket: true,
    addonSync: true,
    noTimeout: true,
    osc52Emitted: false,
    tuiResponsive: false,
    escapeWorks: false,
    eventLoopStuck: true,
    wchan: "do_sys_poll",
    dragSelect: true,
    fullscreen: true,
    killOnly: true,
    outputText:
      "clasped; #91306; drag-select → sync setLinuxClipboardText hang on mute X DISPLAY socket",
  });
  assert.ok(chips.includes("clasped"));
  assert.ok(chips.includes("display-hang"));
  assert.ok(chips.includes("clipboard-napi-sync"));
  assert.ok(chips.includes("no-timeout"));
  assert.ok(!chips.includes("sprung"));
});

test("cousin #61936 is not conflated with clasped primary", () => {
  assert.notEqual(classify(seedCousin()), "clasped");
  assert.notEqual(classify({ issue: 61936 }), "clasped");
  const cousin = analyze(seedCousin());
  assert.ok(cousin.reasons.some((row) => /61936|cousin/i.test(row)));
});

test("cite-only cousins are not primaries and do not become clasped", () => {
  for (const issue of COUSINS) {
    assert.notEqual(classify({ issue }), "clasped", String(issue));
    assert.notEqual(issue, FEATURED_ISSUE);
  }
  assert.equal(FEATURED_ISSUE, 91306);
});

test("named verdicts each have a seed and a hold/alarm split", () => {
  assert.equal(analyze(seedDisplayHang()).verdict, "display-hang");
  assert.equal(analyze(seedClipboardNapiSync()).verdict, "clipboard-napi-sync");
  assert.equal(analyze(seedNoTimeout()).verdict, "no-timeout");
  assert.equal(analyze(seedXSocketMute()).verdict, "x-socket-mute");
  assert.equal(analyze(seedDragSelectFreeze()).verdict, "drag-select-freeze");
  assert.equal(analyze(seedNoOsc52Fallback()).verdict, "no-osc52-fallback");
  assert.equal(analyze(seedKillOnlyEscape()).verdict, "kill-only-escape");
  assert.equal(analyze(seedEventLoopStuck()).verdict, "event-loop-stuck");
  assert.equal(analyze(seedHasRepro()).verdict, "has-repro");
  assert.equal(analyze(seedHold()).ticket.osc52Emitted, true);
  assert.equal(isClasped(seedSprung()), false);
  assert.equal(isClasped(seedClasped()), true);
});

test("living page is a Fibula atelier, idle sprung, seeded clasped", () => {
  const html = readPage();
  assert.match(html, /<title>Fibula/);
  assert.match(html, /Idle word:\s*sprung/);
  assert.match(html, /sprung/);
  assert.match(html, /clasped/);
  assert.match(html, /display-hang/);
  assert.match(html, /clipboard-napi-sync/);
  assert.match(html, /no-timeout/);
  assert.match(html, /x-socket-mute/);
  assert.match(html, /drag-select-freeze/);
  assert.match(html, /no-osc52-fallback/);
  assert.match(html, /kill-only-escape/);
  assert.match(html, /event-loop-stuck/);
  assert.match(html, /has-repro/);
  assert.match(html, /#91306/);
  assert.match(html, /#61936/);
  assert.match(html, /#72173/);
  assert.match(html, /#89097/);
  assert.match(html, /#74214/);
  assert.match(html, /#88898/);
  assert.match(html, /#80330/);
  assert.match(html, /#88779/);
  assert.match(html, /33968/);
  assert.match(html, /cousin-not-primary|cousin, not primary/i);
  assert.match(html, /09:50/);
  assert.match(html, /catalog #110/);
  assert.match(html, /2\.1\.257/);
  assert.match(html, /2\.1\.219/);
  assert.match(html, /2\.1\.231/);
  assert.match(html, /setLinuxClipboardText/);
  assert.match(html, /DISPLAY=:20/);
  assert.match(html, /do_sys_poll/);
  assert.match(html, /OSC 52/);
  assert.match(html, /family=Cormorant\+Garamond|Cormorant Garamond/);
  assert.match(html, /family=Outfit|Outfit/);
  assert.match(html, /family=Fira\+Code|Fira Code/);
  assert.match(html, /Score the pin/);
  assert.match(html, /Pin idle sprung/);
  assert.match(html, /Pin seeded clasped/);
  assert.match(html, /Admit sprung/);
  assert.match(html, /bow fibula|catch-plate|cloak fold|wax tablet|iron stylus|terracotta/i);
  assert.match(html, /FULLSCREEN DRAG-SELECT → SYNC clipboard-napi setLinuxClipboardText HANG/);
  assert.match(html, /#hermes-catalog/);
  assert.match(html, /mute DISPLAY/i);
  assert.match(html, /embed/);
  assert.doesNotMatch(html, /Idle word:\s*clasped/i);
  assert.doesNotMatch(html, /Idle word:\s*literal/i);
  assert.doesNotMatch(html, /Idle word:\s*jammed/i);
  assert.doesNotMatch(html, /Idle word:\s*sifted/i);
  assert.doesNotMatch(html, /Idle word:\s*stocked/i);
  assert.doesNotMatch(html, /Idle word:\s*aired/i);
  assert.doesNotMatch(html, /Idle word:\s*drained/i);
  assert.doesNotMatch(html, /Idle word:\s*hinged/i);
  assert.doesNotMatch(html, /Idle word:\s*pealed/i);
  assert.doesNotMatch(html, /Idle word:\s*warded/i);
  assert.doesNotMatch(html, /Idle word:\s*first-wins/i);
  assert.doesNotMatch(html, /Idle word:\s*seized/i);
  assert.doesNotMatch(html, /Idle word:\s*pooled/i);
  assert.doesNotMatch(html, /Idle word:\s*cased/i);
  assert.doesNotMatch(html, /Pin idle clasped/);
  assert.doesNotMatch(html, /Pin idle literal/);
  assert.doesNotMatch(html, /Pin idle jammed/);
  assert.doesNotMatch(html, /Score the stick/);
  assert.doesNotMatch(html, /Score the loft/);
  assert.doesNotMatch(html, /Score the hinge/);
  assert.doesNotMatch(html, /Score the race/);
  assert.doesNotMatch(html, /Score the peal/);
  assert.doesNotMatch(html, /Score the peg/);
  assert.doesNotMatch(html, /Score the postern/);
  assert.doesNotMatch(html, /Score the mesh/);
  assert.doesNotMatch(html, /family=Libre\+Baskerville/);
  assert.doesNotMatch(html, /family=Work\+Sans/);
  assert.doesNotMatch(html, /family=JetBrains\+Mono/);
  assert.doesNotMatch(html, /family=Newsreader/);
  assert.doesNotMatch(html, /family=Public\+Sans/);
  assert.doesNotMatch(html, /family=Source\+Code\+Pro/);
  assert.doesNotMatch(html, /family=Literata/);
  assert.doesNotMatch(html, /family=Atkinson/);
  assert.doesNotMatch(html, /family=IBM\+Plex/);
  assert.doesNotMatch(html, /family=Fraunces/);
  assert.doesNotMatch(html, /family=Syne/);
  assert.doesNotMatch(html, /family=DM\+Sans/);
  assert.doesNotMatch(html, /family=Playfair/);
  assert.doesNotMatch(html, /family=Cinzel/);
  assert.doesNotMatch(html, /family=Libre\+Caslon/);
  for (const word of FORBIDDEN_UI) {
    assert.doesNotMatch(
      html,
      new RegExp(word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"),
    );
  }
});

test("README and page stay Fibula, not a clone", () => {
  const readme = readReadme();
  assert.match(readme, /^# Fibula/m);
  assert.match(readme, /Why not a clone/);
  assert.match(
    readme,
    /FULLSCREEN DRAG-SELECT → SYNC clipboard-napi setLinuxClipboardText HANG/,
  );
  assert.match(readme, /NOT \*\*Virgule\*\*/);
  assert.match(readme, /NOT \*\*Riddle\*\*/);
  assert.match(readme, /NOT \*\*Garner\*\*/);
  assert.match(readme, /NOT \*\*Pintle\*\*/);
  assert.match(readme, /NOT \*\*Carillon\*\*/);
  assert.match(readme, /NOT \*\*Postern\*\*/);
  assert.match(readme, /Product name stays \*\*Fibula\*\*/);
  assert.match(readme, /Idle word: \*\*sprung\*\*/);
  assert.match(readme, /#61936/);
  assert.match(readme, /#72173/);
  assert.match(readme, /#89097/);
  assert.match(readme, /setLinuxClipboardText/);
  assert.match(readme, /Remote-Containers/);
  assert.doesNotMatch(readme, /^# Virgule/m);
  assert.doesNotMatch(readme, /^# Riddle/m);
  assert.doesNotMatch(readme, /^# Garner/m);
  assert.doesNotMatch(readme, /^# Pintle/m);
});
