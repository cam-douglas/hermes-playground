# Carillon hook

Tiny peal-board classifier for plugin SessionStart first-wins dispatch. When more than one plugin contributes a `SessionStart` hook, only the first-registered is dispatched. The rest never execute. No error is logged. `/reload-plugins` and `/hooks` still count every hook. `settings.json` SessionStart hooks are unaffected.

Idle word is **pealed**. Seeded state is first-wins / #91250 (`/hooks` counts 3 plugins, only the first peals; 1 struck + 2 muted). Never idle as first-wins / drained / pooled / warded / squatted / stationed / displaced / hung / marvered / unpinned / shed / sealed / rinsed / vacant / postern / sluice.

```bash
node projects/carillon/hook/carillon.mjs projects/carillon/data/91250.json
node projects/carillon/hook/carillon.mjs projects/carillon/data/pealed.json
echo '{"pluginSessionStartRegistered":3,"pluginSessionStartDispatched":1}' | node projects/carillon/hook/carillon.mjs
node --test projects/carillon/hook/carillon.test.mjs
```

Empty stdin uses the idle **pealed** ticket. Stdout is JSON: `verdict`, `chips[]`, `reasons[]`, `pealed`, `firstWins`, `hold`, `alarm`, `idleWord`.

- **PEALED** if `settings.json` three SessionStart handlers all fire and deliver `additionalContext` (hold; board 3/3)
- **FIRST-WINS** if plugin SessionStart registry N, peal 1; first-registered wins; the rest are dropped (#91250)
- **REGISTERED-NOT-PEALED** if `/hooks` count ≠ dispatched peal count
- **SETTINGS-ALL-FIRE** if settings.json SessionStart hooks all ran (unaffected)
- **PLUGIN-ONLY-DROP** if the drop is specific to plugin-contributed hooks
- **SILENT-NO-ERROR** if the other never executes and no error was logged
- **HOOKS-COUNT-LIES** if `/hooks` counts all hooks but dispatch does not
- **RELOAD-PLUGINS-OK** if `/reload-plugins` counts all hooks (registration looks healthy)
- **ADDITIONALCONTEXT-ONE** if only one hook's context arrives
- **REGRESSION-216** if the version is in v2.1.216 – v2.1.252 (18 versions, 85 sessions, never more than one)
- **HOLD** if all hooks fire (working range up to v2.1.198, multiple plugin SessionStart hooks, up to 4)

This is a diagnostic scoring bench. Not an exploit. No payloads. Score whether the peal is pealed or first-wins.

Primary: [anthropics/claude-code#91250](https://github.com/anthropics/claude-code/issues/91250). Cousins (not primaries): claude-code [#88086](https://github.com/anthropics/claude-code/issues/88086) VS Code additionalContext inject miss; [#88650](https://github.com/anthropics/claude-code/issues/88650) additive plugin.json + hooks.json; [#83643](https://github.com/anthropics/claude-code/issues/83643) remote plugin sync omits hooks/; [#75972](https://github.com/anthropics/claude-code/issues/75972) plugin hooks.json never fires; [#76297](https://github.com/anthropics/claude-code/issues/76297) settings↔plugin not deduplicated; [#78455](https://github.com/anthropics/claude-code/issues/78455) phantom SessionStart; [#10373](https://github.com/anthropics/claude-code/issues/10373) SessionStart not processed for new conversations. openai/codex [codex#39895](https://github.com/openai/codex/issues/39895) root plugin.json silently disables hooks; [codex#42079](https://github.com/openai/codex/issues/42079); [codex#34321](https://github.com/openai/codex/issues/34321).

Hypothesis only (NON-BINDING): first-wins dispatch on plugin SessionStart (registry N, peal 1). Do not claim a root cause in Claude Code source you have not seen.

NOT Callboard / Pale / Ambo / Tappet / Pawl / Postern / Sluice / Alidade / Parison / Cockade / Lye / Limpet / Quench / Bulla. Product name stays Carillon. Do not rename to Peal / Belfry / Campanile / Change / Sally / Treble / Tenor / Clapper / Bellcote.
