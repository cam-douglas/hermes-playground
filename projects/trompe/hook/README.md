# Trompe hook

Tiny trompe-l'œil gallery scorer for a painted false clear: the desktop command-chip renderer tests whether message **content contains** `<command-name>/clear</command-name>` (and sibling tags). Quoting that tag as ordinary text paints a real `/clear` chip, an "(no output)" line, and a "Context cleared" banner, then collapses scrollback. No clear happens. The session JSONL stays complete. A planted canary is still recalled. Pipe a probe ticket (`quotedTag` / `chipPainted` / `bannerShown` / `scrollbackCollapsed` / `jsonlContinuous` / `canaryRecalled` / `actualClear`) and get **phantom** or **intact**.

Idle word is **intact**. Seeded state is phantom / #90881. Never idle as "trompe" / "gallery" / "gilt" / "clear" / "chip" / "banner" / "pane" / "desktop" / "scrollback".

```bash
node projects/trompe/hook/trompe.mjs < projects/trompe/data/90881.json
node projects/trompe/hook/trompe.mjs projects/trompe/data/intact.json
node --test projects/trompe/hook/trompe.test.mjs
```

Empty stdin uses the seeded #90881 phantom ticket. Stdout is JSON: `verdict`, `chips[]`, `reasons[]`, `intact`, `phantom`, `hold`, `alarm`, `idleWord`.

- **INTACT** if no painted chip, no false banner, scrollback visible, JSONL continuous, canary in context
- **PHANTOM** if a quoted tag painted a destructive clear that never ran (#90881)
- **CLEARED** if the UI claims context cleared
- **COLLAPSED** if prior scrollback is visually hidden
- **SUBSTRING** if `.includes('<command-name>/clear</command-name>')` hits message content
- **CHIP-LIED** if a real `/clear` chip was painted for quoted text
- **SCROLLBACK-HID** if prior turns collapsed out of view
- **CANARY-KEPT** if the planted canary is still recalled after the painted clear
- **QUOTED-TAG** if the tag was quoted as documentation, not a command
- **FALSE-BANNER** if "Context cleared" fired with no actual clear
- **RENDER-ONLY** if this is a front-end render artifact and JSONL did not change
- **NO-TRUNCATE** if session JSONL is continuous and untruncated
- **ENVELOPE-MISS** if there was no leading-slash / command-envelope / author-role gate

Primary: [anthropics/claude-code#90881](https://github.com/anthropics/claude-code/issues/90881). Same-class (cite, not primary): [#53715](https://github.com/anthropics/claude-code/issues/53715) CLOSED VSCode phantom `/clear` autocomplete; [#88367](https://github.com/anthropics/claude-code/issues/88367) `/clear` drops session name. Cross-ecosystem: [openai/codex#41758](https://github.com/openai/codex/issues/41758) UI/journal lie; [openai/codex#41748](https://github.com/openai/codex/issues/41748) success UI nothing persisted.

NOT Ambo / Carcase / Callboard / Chad / Husk / Davy.
