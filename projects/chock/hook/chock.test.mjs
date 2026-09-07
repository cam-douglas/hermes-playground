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
  seedBarred,
  seedAdmitted,
  fingerprint,
  userOnlyFenceSignal,
  headerListsAllSignal,
  projectIgnoredSignal,
  localIgnoredSignal,
  sandboxAllowWithinDenySignal,
  addDirWorksSignal,
  unattendedBlockedSignal,
  fenceAdmitsProjectLocal,
  HOLD,
  ALARM,
  MEASURED,
  CHIPS,
  VERDICTS,
  COUSINS,
  SETTINGS_LAYERS,
  IDLE_WORD,
  SEEDED_WORD
} from "./chock.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const page = readFileSync(join(root, "index.html"), "utf8");
const readme = readFileSync(join(root, "README.md"), "utf8");
const hookReadme = readFileSync(join(root, "hook", "README.md"), "utf8");
const dataReadme = readFileSync(join(root, "data", "README.md"), "utf8");

test("primary 92582 fixture scores barred", () => {
  const primary = JSON.parse(readFileSync(join(root, "data", "92582.json"), "utf8"));
  const out = decide(primary);
  assert.equal(out.verdict, "barred");
  assert.equal(out.barred, true);
  assert.ok(out.chips.includes("barred"));
});

test("empty / idle probe is barred", () => {
  const out = decide({});
  assert.equal(out.verdict, "barred");
  assert.equal(out.barred, true);
  assert.equal(out.admitted, false);
  assert.ok(ALARM.has("barred"));
  assert.equal(IDLE_WORD, "barred");
});

test("seeded barred scores barred", () => {
  const out = decide(seedBarred());
  assert.equal(out.verdict, "barred");
  assert.equal(out.barred, true);
  assert.ok(out.chips.includes("barred"));
  assert.ok(out.chips.includes("user-only-fence"));
  assert.ok(out.chips.includes("header-lists-all"));
});

test("admitted seed is a hold", () => {
  const out = decide(seedAdmitted());
  assert.equal(out.verdict, "admitted");
  assert.equal(out.admitted, true);
  assert.equal(out.barred, false);
  assert.ok(HOLD.has(out.verdict));
  assert.equal(SEEDED_WORD, "admitted");
});

test("user-only-fence chip", () => {
  const out = decide({ seed: "user-only-fence", userOnlyFence: true });
  assert.equal(out.verdict, "user-only-fence");
  assert.equal(out.barred, true);
  assert.match(out.reasons.join(" "), /only cwd, A, B/);
  assert.match(out.reasons.join(" "), /blockReadsOutsideWorkingDirectories/);
});

test("header-lists-all chip", () => {
  const out = decide({ seed: "header-lists-all", headerListsAll: true });
  assert.equal(out.verdict, "header-lists-all");
  assert.ok(out.chips.includes("header-lists-all"));
  assert.match(out.reasons.join(" "), /A, B, C and D/);
  assert.match(out.reasons.join(" "), /settings are being read/);
});

test("project-ignored chip", () => {
  const out = decide({ seed: "project-ignored", projectIgnored: true });
  assert.equal(out.verdict, "project-ignored");
  assert.match(out.reasons.join(" "), /hasTrustDialogAccepted/);
  assert.match(out.reasons.join(" "), /\[C, D\]/);
});

test("local-ignored chip", () => {
  const out = decide({ seed: "local-ignored", localIgnored: true });
  assert.equal(out.verdict, "local-ignored");
  assert.match(out.reasons.join(" "), /settings\.local\.json/);
  assert.match(out.reasons.join(" "), /untracked/);
});

test("sandbox-allowWithinDeny chip", () => {
  const out = decide({ seed: "sandbox-allowWithinDeny", sandboxAllowWithinDeny: true });
  assert.equal(out.verdict, "sandbox-allowWithinDeny");
  assert.match(out.reasons.join(" "), /allowWithinDeny/);
  assert.match(out.reasons.join(" "), /Operation not permitted/);
});

test("add-dir-works chip", () => {
  const out = decide({ seed: "add-dir-works", addDirWorks: true });
  assert.equal(out.verdict, "add-dir-works");
  assert.match(out.reasons.join(" "), /\/add-dir C/);
  assert.match(out.reasons.join(" "), /same session/);
});

test("unattended-blocked chip", () => {
  const out = decide({ seed: "unattended-blocked", unattendedBlocked: true });
  assert.equal(out.verdict, "unattended-blocked");
  assert.match(out.reasons.join(" "), /unattended scheduled sessions/);
  assert.match(out.reasons.join(" "), /interactive session/);
});

test("cousins cite-only", () => {
  const out = decide({ seed: "cousins", cousinsCiteOnly: [91848, 83031, 92615] });
  assert.equal(out.verdict, "cousins");
  assert.match(out.reasons.join(" "), /#91848/);
  assert.match(out.reasons.join(" "), /#83031/);
  assert.match(out.reasons.join(" "), /#92615/);
  assert.match(out.reasons.join(" "), /Fairlead/);
  assert.match(out.reasons.join(" "), /Deadman/);
});

test("has-clear-repro chip from labels", () => {
  const out = decide({ seed: "has-clear-repro", hasClearRepro: true });
  assert.equal(out.verdict, "has-clear-repro");
  assert.match(out.reasons.join(" "), /has-clear-repro/);
  assert.match(out.reasons.join(" "), /has repro/);
});

test("analyze / score / handle / seeds / scoreFields", () => {
  const idle = analyze({});
  assert.equal(idle.verdict, "barred");
  assert.equal(score(seedAdmitted()).verdict, "admitted");
  assert.equal(handle('{"seed":"barred","barred":true}').verdict, "barred");
  assert.equal(handle({ seed: "admitted", admitted: true }).verdict, "admitted");
  const bag = seeds();
  assert.equal(decide(bag.barred).verdict, "barred");
  assert.equal(decide(bag.admitted).verdict, "admitted");
  assert.equal(scoreFields(seedBarred()).barred, true);
});

test("fingerprint detects user-only fence, header, sandbox, add-dir", () => {
  assert.equal(userOnlyFenceSignal("only cwd, A, B are allowed; user-only-fence"), true);
  assert.equal(headerListsAllSignal("header lists A, B, C, D as additional working directories"), true);
  assert.equal(projectIgnoredSignal("project-ignored trusted project .claude/settings.json"), true);
  assert.equal(localIgnoredSignal("settings.local.json local-ignored untracked"), true);
  assert.equal(sandboxAllowWithinDenySignal("allowWithinDeny Operation not permitted"), true);
  assert.equal(addDirWorksSignal("/add-dir C in the same session"), true);
  assert.equal(unattendedBlockedSignal("unattended scheduled sessions /add-dir needs an interactive"), true);
  const print = fingerprint(seedBarred());
  assert.equal(print.userOnly, true);
  assert.equal(print.headerAll, true);
  assert.equal(print.barredHit, true);
});

test("fingerprint scores admitted clean fence", () => {
  const print = fingerprint(seedAdmitted());
  assert.equal(print.admittedClean, true);
  assert.equal(print.barredHit, false);
  const out = decide({ ...seedAdmitted(), seed: "admitted" });
  assert.equal(out.admitted, true);
  assert.equal(out.verdict, "admitted");
  assert.equal(fenceAdmitsProjectLocal(seedAdmitted()), true);
  assert.equal(fenceAdmitsProjectLocal(seedBarred()), false);
});

test("classify idle vs hold flags", () => {
  const idle = classify(seedBarred());
  assert.equal(idle.barred, true);
  const hold = classify(seedAdmitted());
  assert.equal(hold.admitted, true);
});

test("settings-layer stack is user / project / local", () => {
  assert.ok(SETTINGS_LAYERS.length === 3);
  assert.ok(SETTINGS_LAYERS.some((row) => row.id === "user" && row.seatsFence === true));
  assert.ok(SETTINGS_LAYERS.some((row) => row.id === "project" && row.seatsFence === false));
  assert.ok(SETTINGS_LAYERS.some((row) => row.id === "local" && row.seatsFence === false));
});

test("measured facts from #92582", () => {
  assert.equal(MEASURED.issue, 92582);
  assert.equal(MEASURED.state, "open");
  assert.deepEqual(MEASURED.labels, ["bug", "has repro", "platform:macos", "area:permissions"]);
  assert.equal(MEASURED.filed, "2026-09-07T02:11:02Z");
  assert.equal(MEASURED.updated, "2026-09-07T02:12:03Z");
  assert.equal(MEASURED.reporter, "ryu1fcgm");
  assert.equal(MEASURED.comments, 0);
  assert.equal(MEASURED.os, "macOS 25.6");
  assert.equal(MEASURED.cliVersion, "2.1.263");
  assert.equal(MEASURED.desktopVersion, "1.46388.4");
  assert.deepEqual(MEASURED.userAdditionalDirectories, ["A", "B"]);
  assert.deepEqual(MEASURED.projectAdditionalDirectories, ["C", "D"]);
  assert.equal(MEASURED.hasTrustDialogAccepted, true);
  assert.equal(MEASURED.blockReadsOutsideWorkingDirectories, true);
  assert.deepEqual(MEASURED.headerLists, ["A", "B", "C", "D"]);
  assert.deepEqual(MEASURED.fenceAllows, ["cwd", "A", "B"]);
  assert.deepEqual(MEASURED.sandboxAllowWithinDeny, ["cwd", "A", "B"]);
  assert.equal(MEASURED.sandboxCatUnderC, "Operation not permitted");
  assert.equal(MEASURED.addDirWorks, true);
  assert.equal(IDLE_WORD, "barred");
  assert.equal(SEEDED_WORD, "admitted");
});

test("HOLD is admitted; ALARM is barred family", () => {
  assert.ok(HOLD.has("admitted"));
  assert.equal(ALARM.has("admitted"), false);
  for (const chip of [
    "barred",
    "user-only-fence",
    "header-lists-all",
    "project-ignored",
    "local-ignored",
    "sandbox-allowWithinDeny",
    "add-dir-works",
    "unattended-blocked",
    "cousins",
    "has-clear-repro"
  ]) {
    assert.ok(ALARM.has(chip), chip);
  }
  assert.deepEqual(CHIPS, VERDICTS);
  assert.deepEqual(VERDICTS, [
    "barred",
    "admitted",
    "user-only-fence",
    "header-lists-all",
    "project-ignored",
    "local-ignored",
    "sandbox-allowWithinDeny",
    "add-dir-works",
    "unattended-blocked",
    "cousins",
    "has-clear-repro"
  ]);
});

test("cousins table is cite-only 91848 / 83031 / 92615", () => {
  assert.deepEqual(
    COUSINS.map((c) => c.id),
    [91848, 83031, 92615]
  );
});

test("fixtures encode issue facts and score their seeds", () => {
  const files = [
    "barred.json",
    "admitted.json",
    "92582.json",
    "user-only-fence.json",
    "header-lists-all.json",
    "project-ignored.json",
    "local-ignored.json",
    "sandbox-allowWithinDeny.json",
    "add-dir-works.json",
    "unattended-blocked.json",
    "cousins.json",
    "fixtures.json",
    "has-clear-repro.json"
  ];
  for (const name of files) {
    const raw = readFileSync(join(root, "data", name), "utf8");
    assert.match(raw, /92582|chock|barred|admitted/i);
    if (name !== "fixtures.json") {
      const fixture = JSON.parse(raw);
      const out = decide(fixture);
      assert.ok(VERDICTS.includes(out.verdict), `${name} → ${out.verdict}`);
    }
  }
  const index = JSON.parse(readFileSync(join(root, "data", "fixtures.json"), "utf8"));
  assert.equal(index.narrativeNotFixture.idle, "barred");
  assert.equal(index.narrativeNotFixture.seeded, "admitted");
  assert.ok(index.narrativeNotFixture.labels.includes("has repro"));
  assert.ok(index.narrativeNotFixture.labels.includes("area:permissions"));
  const listed = readdirSync(join(root, "data"));
  assert.ok(listed.includes("README.md"));
});

test("living page is a timber wheel-chock yard, not a clone", () => {
  assert.match(page, /Bitter/);
  assert.match(page, /Manrope/);
  assert.match(page, /IBM Plex Mono/);
  assert.doesNotMatch(page, /Chakra Petch/);
  assert.doesNotMatch(page, /Share Tech Mono/);
  assert.doesNotMatch(page, /Playfair Display/);
  assert.doesNotMatch(page, /Work Sans/);
  assert.doesNotMatch(page, /Fira Code/);
  assert.doesNotMatch(page, /Cinzel/);
  assert.doesNotMatch(page, /Plus Jakarta Sans/);
  assert.doesNotMatch(page, /Libre Bodoni/);
  assert.doesNotMatch(page, /Nunito/);
  assert.match(page, /barred/);
  assert.match(page, /admitted/);
  assert.match(page, /#92582/);
  assert.match(page, /Chock/);
  assert.match(page, /embed/);
  assert.match(page, /\?embed=1/);
  assert.match(page, /18:50 \/ hermes catalog #202 \/ #92582/);
  assert.match(page, /Score the chock/);
  assert.match(page, /Pin idle barred/);
  assert.match(page, /Pin seeded admitted/);
  assert.match(page, /Admit admitted/);
  assert.match(page, /Load fixtures/);
  assert.match(page, /Reset to admitted/);
  assert.match(page, /wheel-chock|dry-dock|oak wedge|chalk fence|settings-layer/i);
  assert.match(page, /cousin-not-primary/);
  assert.match(page, /91848/);
  assert.match(page, /83031/);
  assert.match(page, /92615/);
});

test("page stays off neighboring UIs and prior idle words", () => {
  assert.doesNotMatch(page, /deadman's switch/i);
  assert.doesNotMatch(page, /glass-plate/i);
  assert.doesNotMatch(page, /wet-plate/i);
  assert.doesNotMatch(page, /Lydian/i);
  assert.doesNotMatch(page, /mooring bitts/i);
  assert.doesNotMatch(page, /oak wharf/i);
  assert.doesNotMatch(page, /hemp warps/i);
  assert.doesNotMatch(page, /stuffing-box/i);
  assert.doesNotMatch(page, /packing gland/i);
  assert.doesNotMatch(page, /wooden fid/i);
  assert.doesNotMatch(page, /spun yarn/i);
  assert.doesNotMatch(page, /watchtower/i);
  assert.doesNotMatch(page, /larum-bell/i);
  assert.doesNotMatch(page, /seizing loft/i);
  assert.doesNotMatch(page, /chock-rail/i);
  assert.doesNotMatch(page, /\brunaway\b/);
  assert.doesNotMatch(page, /\bhaunted\b/);
  assert.doesNotMatch(page, /\bfouled\b/);
  assert.doesNotMatch(page, /\bproved\b/);
  assert.doesNotMatch(page, /\brazed\b/);
  assert.doesNotMatch(page, /\bculled\b/);
  assert.doesNotMatch(page, /\bstripped\b/);
  assert.doesNotMatch(page, /\bpacked\b/);
  assert.doesNotMatch(page, /\bbelayed\b/);
  assert.doesNotMatch(page, /\bunanswered\b/);
  assert.doesNotMatch(page, /\broused\b/);
  assert.doesNotMatch(page, /\blatched\b/);
  assert.doesNotMatch(page, /\bstaged\b/);
  assert.doesNotMatch(page, /\bvoided\b/);
});

test("README anti-clone encodes the chock thesis", () => {
  assert.match(readme, /Why not a clone/i);
  assert.match(readme, /blockReadsOutsideWorkingDirectories/);
  assert.match(readme, /additionalDirectories/);
  assert.match(readme, /allowWithinDeny/);
  assert.match(readme, /ryu1fcgm/);
  assert.match(readme, /#91848/);
  assert.match(readme, /#83031/);
  assert.match(readme, /#92615/);
  assert.match(readme, /How to score/i);
  assert.match(readme, /hermes-playground-green\.vercel\.app\/chock\//);
  assert.match(readme, /Score barred or admit admitted/);
  assert.match(readme, /NON-BINDING/);
  assert.match(hookReadme, /barred/);
  assert.match(hookReadme, /admitted/);
  assert.match(dataReadme, /barred/);
  assert.match(dataReadme, /admitted/);
});
