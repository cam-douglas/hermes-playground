# Virgule hook

Tiny composing-stick classifier for the mid-message slash/skills menu trigger. Typing `/` no longer opens the slash-command / skill menu unless `/` is at **index 0 of the message**. After any preceding character, `/` is inserted as a literal slash and no menu appears. Bound to index 0, not to the start of a line. The menu itself is healthy at index 0. Full-name invocation still works. Regression 2.1.246 → 2.1.247. Both Claude Code desktop app and terminal CLI.

Idle word is **cased**. Seeded state is literal / #91337 (`/` mid-message inserts literal slash; menu only at message index 0; line-start after newline also broken; menu healthy at index 0; full-name invocation still works; regression 2.1.246→2.1.247). Never idle as literal / jammed / sifted / stocked / aired / drained / hinged / pealed / warded / first-wins / seized / pooled.

```bash
node projects/virgule/hook/virgule.mjs projects/virgule/data/91337.json
node projects/virgule/hook/virgule.mjs projects/virgule/data/cased.json
echo '{"caretIndex":12,"menuOpens":false,"slashLiteral":true,"wordBoundary":true,"lineStartBroken":true,"menuHealthyAtZero":true,"discoveryDead":true,"invocationWorks":true}' | node projects/virgule/hook/virgule.mjs
node --test projects/virgule/hook/virgule.test.mjs
```

Empty stdin uses the idle **cased** ticket. Stdout is JSON: `verdict`, `chips[]`, `reasons[]`, `cased`, `literal`, `hold`, `alarm`, `idleWord`.

Given `{ caretIndex, menuOpens, slashLiteral, wordBoundary, lineStartBroken, menuHealthyAtZero, discoveryDead, invocationWorks }`:

- **CASED** if `/` at word boundary opens slash/skills menu; mid-message discovery works; selection inserts at caret; tokens like `src/utils` stay silent
- **LITERAL** if `/` mid-message inserts literal slash; menu only at message index 0; line-start after newline also broken; menu healthy at index 0; full-name invocation still works; regression 2.1.246→2.1.247 (#91337)
- **INDEX-ZERO-ONLY** if the trigger is bound to message index 0 only
- **MID-MESSAGE-LITERAL** if after any preceding character `/` is a literal slash
- **LINE-START-BROKEN** if `/` as the first character of the second line does nothing either
- **MENU-HEALTHY-AT-ZERO** if at index 0 the menu lists everything correctly (not #48963 / #49148)
- **DISCOVERY-DEAD** if mid-message menu is gone for built-ins, plugins, and `~/.claude/skills/`
- **INVOCATION-STILL-WORKS** if typing a skill name in full mid-message still runs
- **REGRESSION-2-1-247** if last good is 2.1.246 and first bad is 2.1.247
- **WORD-BOUNDARY-EXPECTED** if `/` at a word boundary should open the menu and `/` inside a token stays silent
- **HOLD** if the stick is cased (word-boundary virgule opens the rail)

This is a diagnostic scoring bench. Not an exploit. No payloads. Score whether the stick is cased or literal.

Primary: [anthropics/claude-code#91337](https://github.com/anthropics/claude-code/issues/91337). Cousins (cite only, not primaries): [#48963](https://github.com/anthropics/claude-code/issues/48963) picker entries missing; [#49148](https://github.com/anthropics/claude-code/issues/49148) picker/list completeness; [#55173](https://github.com/anthropics/claude-code/issues/55173) related slash/skills UX; [#44488](https://github.com/anthropics/claude-code/issues/44488) mid-prompt slash FR history; [#40413](https://github.com/anthropics/claude-code/issues/40413) cite-only; [#29752](https://github.com/anthropics/claude-code/issues/29752) cite-only; [#13073](https://github.com/anthropics/claude-code/issues/13073) cite-only.

Hypothesis only (NON-BINDING): the 2.1.247 fix tightening what counts as a slash command (`/--` prompts) may also have tightened where the menu is allowed to trigger (index 0 only). Do not claim a root cause in Claude Code source you have not seen.

NOT riddle-sieve / foundry mesh / grain loft / millrace / peal-board / postern-gate / plane-table / rudder pintle / leftover woodworking / mm-slider. Product name stays Virgule. Do not rename to Slash / Menu / Trigger / Index / Composer / Stick / Case / Sort / Riddle / Garner / Pintle.
