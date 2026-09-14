import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ALARM,
  BACKUPS,
  BOOTH_STATIONS,
  BUILD,
  CHIPS,
  COUSINS,
  DISTRIBUTION,
  EXPECTED,
  FAKE_SECRET_KEYS,
  FEATURED_ISSUE,
  FIELD_MARKS,
  FINGERPRINT_LINES,
  FORBIDDEN_IDLE,
  FORBIDDEN_SEED,
  HOLD,
  HOLD_ALIASES,
  HOST,
  IDLE_WORD,
  ISSUE_URL,
  LABELS,
  NOT_PRODUCTS,
  PATH_WORD,
  PHRASE,
  PLATFORM,
  POSITIVE_CONTROL_WALK,
  PRODUCT_WORD,
  RULED_OUT,
  SALLYPORT_WALK,
  SAMPLE_SALLYPORT_PROOF,
  SEEDED_WORD,
  STATE,
  SURFACE,
  TITLE,
  VERDICTS,
  analyze,
  classify,
  decide,
  emptyTicket,
  fingerprint,
  handle,
  inspectGatehouse,
  inspectHook,
  inspectReminder,
  inspectSallyport,
  inspectStrongroom,
  mapFortress,
  readBooth,
  score,
  scoreGate,
  scoreWalk,
  seedFalseCoverage,
  seedHold,
  seedMtimeNudge,
  seedProduct,
  seedReminderSecretBypass,
  seedSallyport,
  seedSealed,
  seedSystemReminder,
} from "./sallyport.mjs";

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
  return fileURLToPath(new URL("./sallyport.mjs", import.meta.url));
}

test("idle sealed is a hold; gate and sallyport both shut", () => {
  const result = analyze(seedSealed());
  assert.equal(result.verdict, "sealed");
  assert.equal(result.idleWord, "sealed");
  assert.equal(IDLE_WORD, "sealed");
  assert.equal(result.hold, true);
  assert.equal(result.alarm, false);
  assert.equal(result.sealed, true);
  assert.equal(result.phrase, "admit sealed");
  assert.equal(result.sallyport, false);
  assert.equal(result.reminderSecretBypass, false);
  assert.ok(HOLD_ALIASES.includes("sealed"));
  assert.ok(HOLD_ALIASES.includes("redacted"));
  assert.ok(HOLD_ALIASES.includes("guarded"));
  assert.ok(HOLD_ALIASES.includes("hush"));
  assert.ok(HOLD_ALIASES.includes("gate-checked"));
  for (const word of FORBIDDEN_IDLE) {
    assert.notEqual(result.idleWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("empty ticket and empty stdin classify sealed", () => {
  assert.equal(classify(emptyTicket()), "sealed");
  assert.equal(classify(""), "sealed");
  assert.equal(classify(null), "sealed");
  assert.equal(decide({}), "sealed");
});

test("#94082 seeded path scores sallyport when the reminder dumps secrets", () => {
  const result = analyze(seedSallyport());
  assert.equal(result.verdict, "sallyport");
  assert.equal(result.seededWord, "sallyport");
  assert.equal(SEEDED_WORD, "sallyport");
  assert.equal(PRODUCT_WORD, "sallyport");
  assert.equal(result.hold, false);
  assert.equal(result.alarm, true);
  assert.equal(result.sallyport, true);
  assert.equal(result.phrase, "score sallyport");
  assert.equal(result.reminderSecretBypass, true);
  assert.equal(result.fullContentsDump, true);
  for (const word of FORBIDDEN_SEED) {
    assert.notEqual(result.seededWord, word);
    assert.notEqual(result.verdict, word);
  }
});

test("inspectors mark open sallyport and leaked strongroom", () => {
  const door = inspectSallyport({ sallyport: true, reminderSecretBypass: true });
  assert.equal(door.stamp, "sallyport-open");
  assert.equal(door.open, true);
  const reminder = inspectReminder({ sallyport: true, systemReminder: true });
  assert.equal(reminder.stamp, "system-reminder");
  assert.equal(reminder.injected, true);
  const room = inspectStrongroom({ sallyport: true, fullContentsDump: true });
  assert.equal(room.stamp, "keys-leaked");
  const scored = scoreGate({
    sallyport: true,
    reminderSecretBypass: true,
    systemReminder: true,
    fullContentsDump: true,
    cue: "sallyport",
  });
  assert.equal(scored.verdict, "sallyport");
  const shut = inspectSallyport({ sealed: true, sallyport: false });
  assert.equal(shut.stamp, "sallyport-shut");
});

test("path word is reminder-secret-bypass; booth seed holds the path", () => {
  assert.equal(PATH_WORD, "reminder-secret-bypass");
  const result = analyze(seedReminderSecretBypass());
  assert.equal(result.verdict, "reminder-secret-bypass");
  assert.equal(result.pathWord, "reminder-secret-bypass");
  assert.equal(result.hold, false);
  assert.equal(
    classify({ seed: "reminder-secret-bypass", preferSeed: true, sallyport: true }),
    "reminder-secret-bypass",
  );
  assert.equal(classify(seedSystemReminder()), "system-reminder");
  assert.equal(score(seedReminderSecretBypass()), "sallyport");
});

test("HOLD includes sealed / hold", () => {
  assert.ok(HOLD.includes("sealed"));
  assert.ok(HOLD.includes("hold"));
  const hold = analyze(seedHold());
  assert.equal(hold.verdict, "hold");
  assert.equal(hold.hold, true);
  assert.equal(classify({ seed: "hold", preferSeed: true }), "hold");
});

test("alarm chips: mtime-nudge, system-reminder, sallyport", () => {
  assert.equal(classify(seedMtimeNudge()), "mtime-nudge");
  assert.equal(classify(seedSystemReminder()), "system-reminder");
  assert.equal(classify(seedProduct()), "sallyport");
  assert.equal(classify(seedFalseCoverage()), "false-coverage");
});

test("booth fixtures flip sealed vs sallyport vs reminder-secret-bypass", () => {
  const idle = scoreGate(seedSealed());
  const seeded = scoreGate(seedSallyport());
  const sealed = readData("sealed.json");
  const sallyport = readData("sallyport.json");
  const path = readData("reminder-secret-bypass.json");
  const holdFix = readData("hold.json");
  assert.equal(idle.verdict, "sealed");
  assert.equal(seeded.verdict, "sallyport");
  assert.notEqual(idle.verdict, seeded.verdict);
  assert.equal(score(seedSealed()), "sealed");
  assert.equal(score(seedSallyport()), "sallyport");
  assert.equal(score({ seed: "reminder-secret-bypass", preferSeed: true }), "sallyport");
  assert.equal(sealed.reminderSecretBypass, false);
  assert.equal(sealed.sealed, true);
  assert.equal(scoreGate(sealed).verdict, "sealed");
  assert.equal(sallyport.reminderSecretBypass, true);
  assert.equal(sallyport.fullContentsDump, true);
  assert.equal(sallyport.systemReminder, true);
  assert.equal(classify(sallyport), "sallyport");
  assert.equal(path.paths.length, 3);
  assert.match(path.paths[0].rule, /sealed|redacted|guarded|hush|gate-checked/i);
  assert.match(path.paths[1].result, /system-reminder|mtime|full contents|not a tool call/i);
  assert.equal(classify(path), "reminder-secret-bypass");
  assert.equal(sallyport.hubCount, "SALLYPORT");
  assert.equal(sallyport.issue, 94082);
  assert.equal(sallyport.sallyport, true);
  assert.ok(JSON.stringify(sallyport).includes("FAKE_KEY_REDACTED"));
  assert.equal(classify(holdFix), "hold");
  assert.equal(classify(readData("redacted.json")), "redacted");
  assert.equal(classify(readData("guarded.json")), "guarded");
  assert.equal(classify(readData("hush.json")), "hush");
  assert.equal(classify(readData("gate-checked.json")), "gate-checked");
  assert.equal(classify(readData("pretooluse-locked.json")), "pretooluse-locked");
  assert.equal(classify(readData("mtime-nudge.json")), "mtime-nudge");
  assert.equal(classify(readData("system-reminder.json")), "system-reminder");
  assert.equal(classify(readData("full-contents-dump.json")), "full-contents-dump");
  assert.equal(classify(readData("ten-keys.json")), "ten-keys");
  assert.equal(classify(readData("not-a-tool-call.json")), "not-a-tool-call");
  assert.equal(classify(readData("false-coverage.json")), "false-coverage");
  assert.equal(classify(readData("landing.json")), "landing");
  assert.equal(classify(readData("cousins.json")), "cousins");
  assert.equal(classify(readData("backups.json")), "backups");
  assert.equal(classify(readData("walk.json")), "walk");
  assert.equal(classify(readData("has-repro.json")), "has-repro");
  assert.equal(classify(readData("fixtures.json")), "fixtures");
});

test("chips include idle, seeded, path, and walk", () => {
  assert.ok(CHIPS.includes("sealed"));
  assert.ok(CHIPS.includes("sallyport"));
  assert.ok(CHIPS.includes("reminder-secret-bypass"));
  assert.ok(CHIPS.includes("system-reminder"));
  assert.ok(CHIPS.includes("mtime-nudge"));
  assert.ok(CHIPS.includes("redacted"));
  assert.ok(CHIPS.includes("gate-checked"));
  assert.ok(CHIPS.includes("fixtures"));
  assert.ok(CHIPS.includes("walk"));
  assert.ok(ALARM.includes("sallyport"));
  assert.ok(ALARM.includes("reminder-secret-bypass"));
  assert.ok(ALARM.includes("system-reminder"));
  assert.ok(ALARM.includes("mtime-nudge"));
  assert.ok(ALARM.includes("full-contents-dump"));
  assert.ok(VERDICTS.includes("walk"));
  assert.equal(classify({ seed: "fixtures", preferSeed: true }), "fixtures");
  assert.equal(classify({ seed: "walk", preferSeed: true }), "walk");
});

test("published sallyport walk scores sallyport after the idle hold", () => {
  const booth = scoreWalk({ rows: SALLYPORT_WALK });
  assert.equal(booth.verdict, "sallyport");
  assert.ok(booth.sallyportCount >= 1);
  const idle = booth.rows.find((row) => row.event === "cue-sealed");
  assert.equal(idle.sealed, true);
  assert.equal(idle.verdict, "sealed");
  const cut = booth.rows.find((row) => row.event === "reminder-secret-bypass");
  assert.equal(cut.reminderSecretBypass, true);
  const path = booth.rows.find((row) => row.event === "reminder-secret-bypass" && row.t === "path");
  assert.equal(path.verdict, "reminder-secret-bypass");
});

test("SALLYPORT_WALK constant matches the issue fortress walk", () => {
  assert.equal(SALLYPORT_WALK[0].event, "cue-sealed");
  const cut = SALLYPORT_WALK.find((row) => row.event === "reminder-secret-bypass");
  assert.equal(cut.reminderSecretBypass || cut.systemReminder, true);
  const path = SALLYPORT_WALK.find((row) => row.t === "path");
  assert.equal(path.sallyport, true);
  const scoreRow = SALLYPORT_WALK.find((row) => row.event === "sallyport");
  assert.equal(scoreRow.sallyport, true);
});

test("positive control sealed fortress stays sealed", () => {
  const walk = scoreWalk({ rows: POSITIVE_CONTROL_WALK });
  assert.equal(walk.verdict, "sealed");
  const ok = walk.rows.find((row) => row.t === "hold");
  assert.equal(ok.verdict, "sealed");
  const hold = walk.rows.find((row) => row.event === "cue-sealed");
  assert.equal(hold.sealed, true);
  assert.equal(hold.verdict, "sealed");
});

test("issue constants encode only #94082 published facts", () => {
  assert.equal(FEATURED_ISSUE, 94082);
  assert.ok(ISSUE_URL.includes("94082"));
  assert.match(TITLE, /file changed on disk|PreToolUse|secret/i);
  assert.equal(STATE, "OPEN");
  assert.equal(PLATFORM, "macos");
  assert.match(HOST, /system-reminder|harness|file-change/i);
  assert.equal(BUILD, "Claude Code CLI");
  assert.equal(SURFACE, "reminder-secret-bypass");
  assert.deepEqual(
    [...LABELS],
    ["bug", "has-repro", "platform:macos", "area:security", "area:hooks"],
  );
  assert.equal(FIELD_MARKS.length, 5);
  assert.ok(RULED_OUT.some((row) => /Palilalia|#94041/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Sepulchre|#94055/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Postern/i.test(row)));
  assert.ok(RULED_OUT.some((row) => /Portcullis|Wicket|Embrasure/i.test(row)));
  assert.ok(EXPECTED.some((row) => /secret-path|suppress|redact|content diff/i.test(row)));
  assert.match(
    DISTRIBUTION,
    /PreToolUse|system-reminder|mtime|sed -i|nano|\.env|artefakt-secrets|ten live|false sense/i,
  );
  assert.equal(BOOTH_STATIONS.length, 5);
  assert.ok(FINGERPRINT_LINES.includes("reminder-secret-bypass"));
  assert.ok(FINGERPRINT_LINES.includes("sallyport"));
  assert.equal(PHRASE, "Score sallyport or admit sealed.");
  assert.equal(SAMPLE_SALLYPORT_PROOF.reminderSecretBypass, true);
  assert.equal(FAKE_SECRET_KEYS.length, 10);
  assert.ok(FAKE_SECRET_KEYS.every((row) => row.includes("FAKE_KEY_REDACTED")));
});

test("has-repro fingerprints encode the published sallyport proof", () => {
  const result = handle(seedSallyport());
  assert.equal(result.published.platform, "macos");
  assert.equal(result.published.surface, "reminder-secret-bypass");
  assert.equal(result.published.host, HOST);
  assert.match(
    fingerprint(seedSallyport()),
    /sallyport\|kind=reminder-secret-bypass\|ref=mtime\|path=reminder-secret-bypass\|cue=reminder-secret-bypass/,
  );
  assert.equal(classify({ seed: "has-repro", preferSeed: true }), "has-repro");
});

test("forbidden idle list includes silenced/living/cleared and recent catalog words", () => {
  const required = [
    "silenced",
    "living",
    "cleared",
    "spanned",
    "matched",
    "inscribed",
    "berthed",
    "pegged",
    "tempered",
    "quiescent",
    "palilalia",
    "sepulchre",
    "sneck",
    "drawbridge",
    "chirograph",
    "titulus",
    "derelict",
    "vestry",
    "surfeit",
    "phosphene",
    "scotoma",
    "postern",
    "portcullis",
    "wicket",
    "embrasure",
    "goal-stop-refire",
    "bash-nul-poison",
    "chip-dismiss-ephemeral",
  ];
  for (const word of required) {
    assert.ok(FORBIDDEN_IDLE.includes(word), `missing forbidden idle ${word}`);
  }
});

test("sealed booth flips sallyport back when the fortress is sealed", () => {
  const tape = {
    sealed: true,
    sallyport: false,
    reminderSecretBypass: false,
    cue: "sealed",
  };
  assert.equal(scoreGate(tape).verdict, "sealed");
  tape.sealed = false;
  tape.sallyport = true;
  tape.reminderSecretBypass = true;
  tape.systemReminder = true;
  tape.cue = "sallyport";
  assert.equal(scoreGate(tape).verdict, "sallyport");
  tape.sealed = true;
  tape.sallyport = false;
  tape.reminderSecretBypass = false;
  tape.systemReminder = false;
  tape.cue = "sealed";
  assert.equal(scoreGate(tape).verdict, "sealed");
});

test("gatehouse, reminder, strongroom, and readBooth mark the sallyport proof", () => {
  const idle = inspectGatehouse({
    sealed: true,
    pretooluseLocked: true,
  });
  assert.equal(idle.stamp, "gate-locked");
  const reminder = inspectReminder({ sallyport: true, systemReminder: true });
  assert.equal(reminder.stamp, "system-reminder");
  assert.equal(reminder.injected, true);
  const room = inspectStrongroom({ sallyport: true, fullContentsDump: true });
  assert.equal(room.stamp, "keys-leaked");
  const booth = readBooth({
    sallyport: true,
    reminderSecretBypass: true,
    systemReminder: true,
  });
  assert.equal(booth.sallyport, true);
  assert.equal(booth.mark, "sallyport");
  const shut = readBooth({
    sealed: true,
    sallyport: false,
    reminderSecretBypass: false,
  });
  assert.equal(shut.sallyport, false);
  assert.equal(shut.mark, "sealed");
  assert.equal(inspectHook({ sallyport: true, notAToolCall: true }).stamp, "hook-bypassed");
  assert.equal(inspectStrongroom({ sealed: true }).stamp, "keys-redacted");
});

test("mapFortress encodes the published open sallyport", () => {
  const miss = mapFortress({ sallyport: true, reminderSecretBypass: true });
  assert.equal(miss.stamp, "reminder-secret-bypass");
  assert.equal(miss.holdingLane, "leaked");
  assert.equal(miss.ribbon, "sallyport");
  const clear = mapFortress({ sealed: true, sallyport: false });
  assert.equal(clear.stamp, "sealed-gate");
  assert.equal(clear.kindLane, "gate-checked");
  assert.equal(clear.holdingLane, "redacted");
});

test("cousins cite #92074 #92487 #88441 #89716 #92365 only; products stay distinct; backups stay data-only", () => {
  assert.equal(COUSINS.length, 5);
  assert.equal(COUSINS[0].issue, 92074);
  assert.equal(COUSINS[1].issue, 92487);
  assert.equal(COUSINS[2].issue, 88441);
  assert.equal(COUSINS[3].issue, 89716);
  assert.equal(COUSINS[4].issue, 92365);
  assert.ok(COUSINS.every((row) => row.citeOnly === true));
  assert.ok(NOT_PRODUCTS.includes("palilalia"));
  assert.ok(NOT_PRODUCTS.includes("sepulchre"));
  assert.ok(NOT_PRODUCTS.includes("sneck"));
  assert.ok(NOT_PRODUCTS.includes("drawbridge"));
  assert.ok(NOT_PRODUCTS.includes("postern"));
  assert.ok(NOT_PRODUCTS.includes("portcullis"));
  assert.ok(NOT_PRODUCTS.includes("scotoma"));
  assert.equal(BACKUPS.length, 10);
  assert.equal(BACKUPS[0].issue, 94040);
  assert.equal(BACKUPS[9].issue, 94053);
  assert.ok(BACKUPS.every((row) => row.citeOnly === true));
  assert.ok(!BACKUPS.some((row) => row.issue === 94082));
  assert.ok(!BACKUPS.some((row) => row.issue === 92074));
  assert.equal(classify({ seed: "cousins", preferSeed: true }), "cousins");
  assert.equal(classify({ seed: "backups", preferSeed: true }), "backups");
});

test("CLI scores fixtures without a server", () => {
  const idle = spawnSync(process.execPath, [modelPath()], { encoding: "utf8" });
  const seeded = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/sallyport.json", import.meta.url))],
    { encoding: "utf8" },
  );
  const sealedFix = spawnSync(
    process.execPath,
    [modelPath(), fileURLToPath(new URL("./data/sealed.json", import.meta.url))],
    { encoding: "utf8" },
  );
  assert.equal(idle.status, 0, idle.stderr);
  assert.equal(seeded.status, 0, seeded.stderr);
  assert.equal(sealedFix.status, 0, sealedFix.stderr);
  const idleOut = JSON.parse(idle.stdout);
  const seededOut = JSON.parse(seeded.stdout);
  const sealedOut = JSON.parse(sealedFix.stdout);
  assert.equal(idleOut.verdict, "sealed");
  assert.equal(idleOut.hold, true);
  assert.equal(seededOut.verdict, "sallyport");
  assert.equal(seededOut.alarm, true);
  assert.equal(sealedOut.verdict, "sealed");
  assert.equal(sealedOut.hold, true);
  assert.match(sealedOut.phrase, /admit sealed/);
});

test("handle exposes published hypothesis and #94082 headline", () => {
  const result = handle(seedSallyport());
  assert.equal(result.published.issue, 94082);
  assert.equal(result.published.platform, "macos");
  assert.deepEqual(result.published.cousins, [92074, 92487, 88441, 89716, 92365]);
  assert.ok(result.published.backups.includes(94040));
  assert.ok(result.published.backups.includes(94053));
  assert.ok(!result.published.backups.includes(94082));
  assert.match(result.published.hypothesis, /harness|reminder|PreToolUse|NON-BINDING|#94082/i);
  assert.match(result.published.hypothesis, /NON-BINDING/);
  assert.match(result.published.hypothesis, /#94082/);
  assert.equal(result.published.build, BUILD);
});

test("model has no static node: imports so the sealed page can score in-browser", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /^import .* from "node:/m);
  assert.match(source, /import\("node:fs"\)/);
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
});

test("sealed page is a fortress sallyport, not clinic groove or burial vault or cottage", () => {
  const page = readPage();
  assert.match(page, /family=Newsreader|Newsreader/);
  assert.match(page, /family=Public\+Sans|Public Sans/);
  assert.match(page, /Source\+Code\+Pro|Source Code Pro/);
  assert.match(page, /sallyport|sealed|reminder-secret-bypass|gatehouse|strongroom|iron-grille/i);
  assert.match(page, /#E8E4DC|#1C1F26|#B54A2E|#8B7355|#3D4F5F|#F7F4EE/i);
  assert.match(page, /\bsealed\b/);
  assert.match(page, /\bsallyport\b/);
  assert.match(page, /reminder-secret-bypass/);
  assert.match(page, /Score sallyport or admit sealed/i);
  assert.match(page, /#351/);
  assert.match(page, /#94082/);
  assert.match(page, /Admit sealed/);
  assert.match(page, /Score sallyport/);
  assert.match(page, /Walk reminder-secret-bypass/);
  assert.match(page, /Compare sealed \/ sallyport/);
  assert.match(page, /Pin idle sealed/);
  assert.match(page, /Pin seeded sallyport/);
  assert.match(page, /Pin reminder-secret-bypass/);
  assert.match(page, /Seal the grille/);
  assert.match(page, /Score booth/);
  assert.match(page, /sallyport-score/);
  assert.match(page, /PreToolUse|system-reminder|mtime|sed -i|nano|FAKE_KEY_REDACTED/i);
  assert.match(page, /gatehouse|sallyport|strongroom|torch|corridor|iron/i);
  assert.match(page, /<svg[\s\S]*sallyport|class="sally-arch"/i);
  assert.doesNotMatch(page, /family=Libre\+Baskerville|Libre Baskerville/);
  assert.doesNotMatch(page, /family=DM\+Sans|DM Sans/);
  assert.doesNotMatch(page, /JetBrains Mono|JetBrains\+Mono/);
  assert.doesNotMatch(page, /family=Cardo|Cardo/);
  assert.doesNotMatch(page, /family=Figtree|Figtree/);
  assert.doesNotMatch(page, /IBM\+Plex|IBM Plex/);
  assert.doesNotMatch(page, /family=Cinzel|Cinzel/);
  assert.doesNotMatch(page, /family=EB\+Garamond|EB Garamond/);
  assert.doesNotMatch(page, /family=Oswald|Oswald/);
  assert.doesNotMatch(page, /family=Syne|Syne/);
  assert.doesNotMatch(page, /Big Shoulders/);
  assert.doesNotMatch(page, /family=Spectral|Spectral/);
  assert.doesNotMatch(page, /phonograph|wax-cylinder|stylus/i);
  assert.doesNotMatch(page, /ossuary|limestone lintel|extinguished lamp/i);
  assert.doesNotMatch(page, /cottage|stoop|wool draft|oak plank/i);
  assert.doesNotMatch(page, /bailey|merlon|crenel/i);
  assert.doesNotMatch(page, /night-latch|postern-gate/i);
  assert.doesNotMatch(page, /\bsilenced\b/);
  assert.doesNotMatch(page, /\bliving\b/);
  assert.doesNotMatch(page, /\bspanned\b/);
  assert.doesNotMatch(page, /\bcleared\b/);
  assert.match(page, /NOT Palilalia/i);
  assert.match(page, /NOT Sepulchre/i);
  assert.match(page, /NOT Postern/i);
  assert.match(page, /NOT Portcullis/i);
  assert.doesNotMatch(page, /fetch\(/);
});

test("README states the thesis, anti-clone, and how to score", () => {
  const readme = readReadme();
  assert.match(readme, /Sallyport/);
  assert.match(readme, /#94082/);
  assert.match(readme, /\bsealed\b/);
  assert.match(readme, /\bsallyport\b/);
  assert.match(readme, /reminder-secret-bypass/);
  assert.match(readme, /Newsreader/);
  assert.match(readme, /Public Sans/);
  assert.match(readme, /Source Code Pro/);
  assert.doesNotMatch(readme, /Libre Baskerville/);
  assert.doesNotMatch(readme, /DM Sans/);
  assert.doesNotMatch(readme, /JetBrains/);
  assert.doesNotMatch(readme, /Cardo/);
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /Research brief/i);
  assert.match(readme, /REMINDER-SECRET-BYPASS|file changed on disk|PreToolUse/i);
  assert.match(readme, /NOT Palilalia\/#94041/);
  assert.match(readme, /NOT Sepulchre\/#94055/);
  assert.match(readme, /NOT Postern/);
  assert.match(readme, /#92074|#92487|#88441|#89716|#92365/);
  assert.match(readme, /mtime|system-reminder|sed -i|nano|FAKE_KEY_REDACTED/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/sallyport/);
  assert.match(readme, /node --test projects\/sallyport\/sallyport\.test\.mjs/);
  assert.match(readme, /NON-BINDING/);
  assert.match(readme, /gatehouse|sallyport|strongroom|torch|corridor/i);
  assert.match(readme, /Score sallyport or admit sealed/);
  assert.match(readme, /#94040|#94032|#94031|#94029|#93987|#93924|#93770|#93777|#94059|#94053/);
  assert.match(readme, /10:50/);
  assert.match(readme, /Do NOT implement a fix/i);
  const runLog = readFileSync(fileURLToPath(new URL("../../RUN_LOG.md", import.meta.url)), "utf8");
  assert.match(runLog, /## 2026-09-14 — Sallyport/);
  assert.match(runLog, /10:50/);
});

test("catalog features Sallyport only; Palilalia unfeatured; product count 351", () => {
  const catalog = readCatalog();
  const hub = readHubCatalog();
  assert.equal(catalog.products.length, 351);
  assert.equal(hub.products.length, 351);
  assert.equal(catalog.products[0].name, "Sallyport");
  assert.equal(catalog.products[0].slug, "sallyport");
  assert.equal(catalog.products[0].featured, true);
  assert.equal(catalog.products[0].href, "/sallyport/");
  assert.equal(catalog.products[0].day, "2026-09-14");
  assert.equal(
    catalog.products[0].summary,
    "10:50 sallyport: a fortress sallyport / gatehouse / iron-grille side-passage / torch-lit stone corridor / sealed-strongroom booth for #94082. A PreToolUse Bash hook that blocks cat/grep/head/tail against secret paths can be silently bypassed by the harness \"file changed on disk\" notification, which injects a <system-reminder> with the file's full current contents — every key AND value — because that injection is not a tool call. Idle sealed / seeded sallyport / path reminder-secret-bypass. Score sallyport or admit sealed.",
  );
  assert.equal(hub.products[0].summary, catalog.products[0].summary);
  assert.match(catalog.products[0].summary, /\bsealed\b/);
  assert.match(catalog.products[0].summary, /\bsallyport\b/);
  assert.match(catalog.products[0].summary, /reminder-secret-bypass/);
  assert.match(catalog.products[0].summary, /Score sallyport or admit sealed/);
  assert.match(catalog.products[0].summary, /#94082/);
  assert.equal(hub.products[0].slug, "sallyport");
  assert.equal(hub.products[0].featured, true);
  const palilalia = catalog.products.find((row) => row.slug === "palilalia");
  assert.ok(palilalia);
  assert.equal(palilalia.featured, false);
  const sepulchre = catalog.products.find((row) => row.slug === "sepulchre");
  assert.ok(sepulchre);
  assert.equal(sepulchre.featured, false);
  assert.equal(catalog.products.filter((row) => row.featured).length, 1);
  assert.equal(catalog.products.filter((row) => row.slug === "sallyport").length, 1);
  assert.ok(!catalog.products.some((row) => String(row.summary || "").includes("94082") && row.slug !== "sallyport"));
});

test("vercel rewrites sallyport to the project folder at the top", () => {
  const vercel = readVercel();
  assert.equal(vercel.rewrites[0].source, "/sallyport");
  assert.equal(vercel.rewrites[0].destination, "/projects/sallyport");
  assert.equal(vercel.rewrites[1].source, "/sallyport/");
  assert.equal(vercel.rewrites[1].destination, "/projects/sallyport");
  assert.equal(vercel.rewrites[2].source, "/sallyport/:path*");
  assert.equal(vercel.rewrites[2].destination, "/projects/sallyport/:path*");
});

test("no network calls in the model or tests", () => {
  const source = readFileSync(modelPath(), "utf8");
  assert.doesNotMatch(source, /fetch\(/);
  assert.doesNotMatch(source, /new WebSocket|net\.connect|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/[^\s"']*anthropic\.com\/v1/);
});

test("fixtures never contain live secrets", () => {
  const seeded = readFileSync(fileURLToPath(new URL("./data/sallyport.json", import.meta.url)), "utf8");
  assert.match(seeded, /FAKE_KEY_REDACTED/);
  assert.doesNotMatch(seeded, /sk_live_|eyJhbGci|ghp_|xox[baprs]-|AKIA[0-9A-Z]{16}/);
});
