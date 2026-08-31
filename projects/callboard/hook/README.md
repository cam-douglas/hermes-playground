# Callboard hook

Tiny stage-door scorer for a pre-session discoverability miss: claude.ai-managed skills (`anthropic-skills:*`) are missing from new-chat slash-command autocomplete until the first message is sent. Cache is on disk. `Skill()` loads. Only the menu is blind. Pipe an autocomplete probe ticket (`preSessionMatch` / `postFirstMessageMatch` / `cachePresent` / `manifestFresh` / `localSkillsVisible` / `skillCallable` / `listSkillsShows` / `duplicateEntries` / `namespacedPrefix` / `outputText`) and get **blank** or **rostered**.

Idle word is **rostered**. Seeded state is blank / #90858. Never idle as "callboard" / "board" / "cast" / "skill".

```bash
node projects/callboard/hook/callboard.mjs < projects/callboard/data/90858.json
node projects/callboard/hook/callboard.mjs projects/callboard/data/rostered.json
node --test projects/callboard/hook/callboard.test.mjs
```

Empty stdin uses the seeded #90858 blank ticket. Stdout is JSON: `verdict`, `chips[]`, `reasons[]`, `rostered`, `blank`, `hold`, `alarm`, `idleWord`.

- **ROSTERED** if cloud/plugin skills appear in new-chat autocomplete before any message
- **BLANK** if new-chat autocomplete lists nothing for `anthropic-skills:*` until the first message
- **DEFERRED** if the menu does not read the plugin pipeline until after the first message
- **CACHE-PRESENT** if the skills-plugin cache and a fresh `manifest.json` lastUpdated sit on disk while the menu shows nothing
- **LOCAL-OK** if `~/.claude/skills` still appear in new-chat autocomplete immediately
- **POST-START** if the namespaced skills appear only after the first message starts the session
- **DUPLICATE-WORKAROUND** if copying the skill into `~/.claude/skills` yields TWO autocomplete entries (bare + `anthropic-skills:`)
- **NAMESPACED** if claude.ai skills inject as plugin-namespaced `anthropic-skills:<name>`
- **SCAN-REGRESS** if the ticket cites the 2.1.169 changelog note about a slash-command/skill scan regression from 2.1.161 (unconfirmed)
- **MENU-BLIND** if the cache is present and the new-chat menu does not read it pre-session

Primary: [anthropics/claude-code#90858](https://github.com/anthropics/claude-code/issues/90858). Nearby boundary only (cite, not primary): [#82732](https://github.com/anthropics/claude-code/issues/82732) cloud-shared skills inherit plugin load semantics (no mid-session reload).

NOT Ordo / Kindling / Leaven / Livery / Fetch / Sprag / Reed / Larder / Scion / Hydra / Limpet / Deadband / Almanac / Voucher.
