# Geneva

A **watchmaker geneva-drive / maltese-cross atelier** desk — brass geneva wheel, steel driving pin, enamel chapter-ring of permission modes, jeweler's loupe, oil stone, arbor and jewel; cool brass-and-ivory on a dark walnut ground; hairline graduations; Bodoni Moda + Jost + Space Mono — for a real Claude Code defect: project `.claude/settings.local.json` `permissions.defaultMode: bypassPermissions` **is silently ignored for the Shift+Tab cycle** even though `/status` lists the file as a setting source. CLI flags still restore the mode.

Primary:

- [anthropics/claude-code#91296](https://github.com/anthropics/claude-code/issues/91296) (OPEN, bug, has repro, platform:macos, area:permissions, filed 2026-09-01T19:03:16Z). Title: defaultMode: bypassPermissions in .claude/settings.local.json silently ignored, missing from Shift+Tab cycle. Reporter jimmyjayp.

A geneva that cannot index bypass is not a hold. Score the cross or admit **indexed**.

Idle word: **indexed**. Seeded state: **jumped** / #91296 — local file listed as a setting source but bypass slot missing from the cycle; value ignored. Never idle as jumped / chocked / rolled / clasped / sprung / drained / hinged / pealed / warded / pooled / cased / aired / sifted / stocked / stationed / marvered / unpinned / rinsed / literal / choked.

A **geneva** is a maltese-cross wheel that should **index** one permission-mode slot per Shift+Tab so project-local `.claude/settings.local.json` `defaultMode: bypassPermissions` is the landing tooth. Instead the local file is listed in `/status` sources while the bypass slot is **jumped** and the cycle never contains it.

- **jumped** = #91296: local file listed as a setting source but bypass slot missing from the cycle; value ignored
- **settings-loaded** = `/status` Setting sources: User settings, Shared project settings, Project local settings — file loaded
- **value-ignored** = `permissions.defaultMode: bypassPermissions` in `.claude/settings.local.json` is silently ignored
- **cycle-missing-bypass** = Shift+Tab cycle only `default` (manual), `acceptEdits`, `plan`, and `auto` — `bypassPermissions` completely absent
- **flag-workaround** = `claude --permission-mode bypassPermissions` and `claude --dangerously-skip-permissions` restore bypass to the cycle; isolates settings-file resolution
- **user-auto-conflict** = user-level `~/.claude/settings.json` has `defaultMode: auto`; project-local has `bypassPermissions`; docs say project-local should take precedence
- **has-repro** = jimmyjayp filed #91296; labels include has repro; Claude Code 2.1.257 CLI terminal macOS; comment uyu423 on 2.1.258
- **hold** = project-local defaultMode honored; bypassPermissions present in Shift+Tab cycle; session starts in bypass; the cross is indexed
- **indexed** = HOLD: project-local defaultMode honored; bypassPermissions present in Shift+Tab cycle; session starts in bypass

Verdicts: indexed, jumped, settings-loaded, value-ignored, cycle-missing-bypass, flag-workaround, user-auto-conflict, has-repro, hold.

This is a diagnostic scoring bench. Not an exploit. No payloads. Score whether the cross is indexed or jumped.

Hypothesis only (NON-BINDING): settings merger lists project-local as a source but drops `defaultMode: bypassPermissions` from the cycle set when user-level defaultMode is `"auto"`. Flags inject the mode after cycle construction. Do not claim a root cause in Claude Code source you have not seen.

## Why not a clone

This is specifically: **PROJECT `.claude/settings.local.json` `permissions.defaultMode: bypassPermissions` IS SILENTLY IGNORED FOR THE SHIFT+TAB CYCLE EVEN THOUGH `/status` LISTS THE FILE AS A SETTING SOURCE; CLI FLAGS STILL RESTORE THE MODE.**

NOT **Postern** ([#91223](https://github.com/anthropics/claude-code/issues/91223)) — anyone can bar a postern / who-can-lock.
NOT **Pintle** ([#91226](https://github.com/anthropics/claude-code/issues/91226)) — PreToolUse Bash relative-path deadlock.
NOT **Wastebook** ([#91270](https://github.com/anthropics/claude-code/issues/91270)) — always-allow leak.
NOT **Chatelaine/Bitting** — OAuth.
NOT #86478 (flags also ignored; session stays auto — cite-only; here flags work).
NOT #75235 (Desktop settings.json defaultMode — cite-only).
NOT #88051 (home settings.local.json only in $HOME — cite-only).
NOT #90415 (Browser confirmation ignores allow/defaultMode — cite-only).
NOT **Scotch** ([#91324](https://github.com/anthropics/claude-code/issues/91324)) — CoworkVMService recovery-actions Access is denied.
NOT **Fibula** ([#91306](https://github.com/anthropics/claude-code/issues/91306)) — mute DISPLAY clipboard hang.
NOT **Virgule** ([#91337](https://github.com/anthropics/claude-code/issues/91337)) — slash/skills menu trigger bound to message index 0.
NOT **Riddle** ([#91327](https://github.com/anthropics/claude-code/issues/91327)) — Devcontainer ipset duplicate + set -e firewall abort.
NOT **Garner** ([#91246](https://github.com/anthropics/claude-code/issues/91246)) — Desktop archive-to-pool no TTL.
NOT **Carillon** — plugin SessionStart first-wins.
NOT **Sluice** ([#91265](https://github.com/anthropics/claude-code/issues/91265)) — Cowork Toke/File/SeAt leak.
NOT leftover woodworking / mm-slider / millrace / wagon-scotch / cloak-pin / composing-stick.

Cousins are cite-only on a cousin strip; primary stays #91296.

Product name stays **Geneva**. Do not rename to Settings, Cycle, Bypass, Permissions, Mode, Scotch, Fibula, Virgule, Riddle, Garner, Pintle, Postern.

Different UI: watchmaker's bench / brass maltese-cross / geneva-drive wheel / steel driving pin / enamel chapter-ring / jeweler's loupe / oil stone / arbor and jewel / cool brass-and-ivory / dark walnut / hairline graduations. Bodoni Moda + Jost + Space Mono. NOT Spectral/Sora/IBM Plex Mono (Scotch). NOT Cormorant/Outfit/Fira (Fibula). NOT Libre Baskerville/Work Sans/JetBrains (Virgule). NOT Newsreader/Public Sans/Source Code Pro (Riddle). NOT Literata/Atkinson (Garner). NOT Fraunces (Sluice). NOT Syne/DM Sans (Pintle). NOT Playfair (Carillon). NOT Cinzel (Postern).

Different verbs: score the cross, pin idle indexed, pin seeded jumped, admit indexed, load fixtures, reset to indexed. Not "Score the block/pin/stick/mesh/loft/hinge/peal/peg/postern/race".

Different idle: **indexed**.

## Live catalog path

`/geneva/` is this static watchmaker geneva-drive atelier desk. Path `https://hermes-playground-green.vercel.app/geneva/` and subdomain `https://geneva.hermes-playground-green.vercel.app` are both fine. Demo works with no secrets and no npm. Mark: `11:50 / hermes catalog #112 / #91296`. `?embed=1` hides chrome for the hub living featured well.

1. Idle demo loads **indexed** — project-local defaultMode honored; bypassPermissions present in Shift+Tab cycle; session starts in bypass.
2. Seed **jumped** → #91296: local file listed as a setting source but bypass slot missing from the cycle; value ignored.
3. Atelier UI: brass maltese-cross / geneva-drive / steel driving pin / enamel chapter-ring / jeweler's loupe / oil stone. Indexed = driving pin on the bypass tooth. Jumped = pin skips the slot; value ignored.
4. Cousin cite strip labeled cousin-not-primary: [#75235](https://github.com/anthropics/claude-code/issues/75235) / [#86478](https://github.com/anthropics/claude-code/issues/86478) / [#88051](https://github.com/anthropics/claude-code/issues/88051) / [#90415](https://github.com/anthropics/claude-code/issues/90415) / [#83421](https://github.com/anthropics/claude-code/issues/83421). Cite only. Primary stays #91296.
5. **Score the cross** walks the probe ticket and lights chips on the desk. Chip-switch every verdict. Paste or drop JSON.

## How to score

Open `projects/geneva/index.html` in a browser, or serve the repo root and visit `/geneva/` (Vercel rewrite → `/projects/geneva`). No build step. Optional hook:

```bash
node projects/geneva/hook/geneva.mjs projects/geneva/data/91296.json
node projects/geneva/hook/geneva.mjs projects/geneva/data/indexed.json
node --test projects/geneva/hook/geneva.test.mjs
```

Jumped seed → jumped/alarm. Indexed seed → indexed/hold.

`projects/geneva/hook/geneva.mjs` classifies a probe ticket JSON `{ settingsSourceListed, valueApplied, bypassInCycle, sessionStartsBypass, projectLocalHonored }` and returns `{ verdict, chips[], reasons[], indexed, jumped, hold, alarm, idleWord }`. See `hook/README.md`.

Local fingerprints: `data/91296.json`, `data/jumped.json`, `data/indexed.json`, plus one JSON per other verdict, `data/fingerprints.json`, `data/chips.json`, `data/fixtures.json`, `data/relatives.json`, `data/cousins.json`. Evidence only from issue facts. Use settings.local.json, bypassPermissions, Shift+Tab, default/acceptEdits/plan/auto, `/status` Setting sources, `--permission-mode`, `--dangerously-skip-permissions`, 2.1.257, 2.1.258, managed-settings.json empty, jimmyjayp. Never invent counts.

## Native integrations

1. GitHub fetch of [anthropics/claude-code#91296](https://github.com/anthropics/claude-code/issues/91296). Unauthenticated. Title, state, labels — not a cookbook. Cousins cited on the ledger, not primaries. See `.env.example`.
2. Slack `#hermes-catalog` mention as the ship notice surface (text only; do not post).
3. Claude Code project-local `.claude/settings.local.json` / Shift+Tab cycle as the third native surface. Paste or drop a probe ticket JSON and score it.
4. Atelier UI (watchmaker's bench / brass maltese-cross / geneva-drive / steel driving pin / enamel chapter-ring / jeweler's loupe / oil stone). Indexed = pin on the bypass tooth, jumped = source listed while the slot is jumped.
5. Cousin-not-primary cite strip: #75235, #86478, #88051, #90415, #83421.

## Sources

- [anthropics/claude-code#91296](https://github.com/anthropics/claude-code/issues/91296) OPEN — primary. Product stays Geneva.
- `permissions.defaultMode: "bypassPermissions"` in a project's `.claude/settings.local.json` is silently ignored.
- Bypass never appears in the Shift+Tab mode cycle; session starts in a different mode.
- User-level `~/.claude/settings.json` has `defaultMode: "auto"`; project-local has `bypassPermissions`.
- Docs: project-local should take precedence; a defaultMode other than `"auto"` should apply from any settings file.
- Actual cycle: only `default` (manual), `acceptEdits`, `plan`, and `auto` — `bypassPermissions` completely absent.
- `/status` shows `Setting sources: User settings, Shared project settings, Project local settings` — file loaded, value not applied to the cycle.
- Workaround: `claude --permission-mode bypassPermissions` and `claude --dangerously-skip-permissions` restore bypass to the cycle.
- Isolates settings-file resolution, not bypass disabled for the account.
- Env: Claude Code 2.1.257, CLI terminal, macOS, Claude Max personal; `/Library/Application Support/ClaudeCode/managed-settings.json` empty.
- Comment (uyu423): same after upgrade to 2.1.258; neither user auto nor project bypass applied; only `--dangerously-skip-permissions` works.
- Cousins (cite, not primaries):
  - [#75235](https://github.com/anthropics/claude-code/issues/75235) — Desktop settings.json defaultMode (cite).
  - [#86478](https://github.com/anthropics/claude-code/issues/86478) — flags also ignored; session stays auto (cite; here flags work).
  - [#88051](https://github.com/anthropics/claude-code/issues/88051) — home settings.local.json only in $HOME (cite).
  - [#90415](https://github.com/anthropics/claude-code/issues/90415) — Browser confirmation ignores allow/defaultMode (cite).
  - [#83421](https://github.com/anthropics/claude-code/issues/83421) — cite-only.
