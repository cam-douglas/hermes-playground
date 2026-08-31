# Trompe

A **trompe-l'œil gallery / painted false clear** — a museum wall that paints a `/clear` chip, "(no output)", and a "Context cleared" banner to hide scrollback, while the session JSONL and model context stay fully intact. Warm plaster, gilt frame, soft museum light; Playfair Display + Source Serif 4 + JetBrains Mono.

Primary:

- [anthropics/claude-code#90881](https://github.com/anthropics/claude-code/issues/90881) (OPEN, filed 2026-08-31T02:51:00Z by dnorth123). Title: Desktop app: command-chip renderer matches the command-name tag anywhere in message content, faking a /clear and hiding scrollback (no actual clear). Labels: bug, platform:macos, area:ui, area:desktop. Desktop **1.40609.0** / Claude Code **2.1.251**. Present since desktop **1.14271.0** / CC **2.1.183**. macOS 15.7.3 (24G419).

A painted clear is not a hold. Score the pane or admit **intact**.

Idle word: **intact**. Seeded state: **phantom** / #90881 — quoted tag paints a real `/clear`. Never idle as "trompe" / "gallery" / "gilt" / "clear" / "chip" / "banner" / "pane" / "desktop" / "scrollback".

- **intact** = hold: no painted chip, scrollback visible, JSONL continuous, canary in context
- **phantom** = #90881 primary — quoted `<command-name>/clear</command-name>` painted a destructive clear that never ran
- **cleared** = UI claims context cleared
- **collapsed** = prior scrollback visually hidden
- **substring** = `.includes('<command-name>/clear</command-name>')` on message content
- **chip-lied** = painted a real `/clear` chip for quoted text
- **scrollback-hid** = prior turns collapsed out of view
- **canary-kept** = planted canary still recalled after the painted clear
- **quoted-tag** = tag quoted as documentation, not a command
- **false-banner** = "Context cleared" banner with no actual clear
- **render-only** = front-end render artifact; no JSONL change
- **no-truncate** = session JSONL continuous; record count untruncated
- **envelope-miss** = no leading-slash / command envelope / author-role gate

Verdicts: intact, phantom, cleared, collapsed, substring, chip-lied, scrollback-hid, canary-kept, quoted-tag, false-banner, render-only, no-truncate, envelope-miss.

## Why not a clone

This is specifically: **PAINTED FALSE CLEAR**. Desktop command-chip renderer substring-matches the command-name tag in message *content*, so quoting the tag as ordinary text paints a real `/clear` chip + "(no output)" + "Context cleared" and collapses scrollback, while JSONL is continuous and a planted canary is still recalled.

NOT **Ambo** ([#90685](https://github.com/anthropics/claude-code/issues/90685)) — Ambo fails to show a real message; Trompe falsely shows a destructive clear.
NOT **Carcase** ([#90867](https://github.com/anthropics/claude-code/issues/90867)) — stealth relaunch / Damper RC.
NOT **Callboard** ([#90858](https://github.com/anthropics/claude-code/issues/90858)) — autocomplete blank.
NOT **Chad** ([#90407](https://github.com/anthropics/claude-code/issues/90407)) — AskUserQuestion phantom.
NOT **Husk** — hollow headless success.
NOT **Davy** ([#90886](https://github.com/anthropics/claude-code/issues/90886)) — false boot-canary.

Different UI: trompe-l'œil gallery / gilt frame / painted false depth / museum wall. Warm plaster, gilt, soft museum light. Playfair Display + Source Serif 4 + JetBrains Mono. NOT pit-black + brass gauze + Cinzel. NOT projector-black + red safelight + Special Elite. NOT oak cabinet. NOT bakery maple. NOT marble hydra. NOT stage-door.

Different idle: **intact**.

## Live catalog path

`/trompe/` is this static gallery. Demo works with no secrets and no npm. Mark: `14:50 / hermes catalog #88 / #90881`.

1. Idle demo loads **intact** — short session scrollback with planted canary `CANARY-TROMPE-88`, JSONL continuous, sconce = intact.
2. Seed phantom → quote `<command-name>/clear</command-name>` as ordinary text. The pane paints a fake `/clear` chip, "(no output)", "Context cleared" banner, and hides prior scrollback. Under the gilt: JSONL still has every turn; canary still in model context.
3. Prove intact → ask/recall the canary. It answers `CANARY-TROMPE-88` even after the painted clear.
4. Chip-switch seeds: phantom / intact / cleared / collapsed / substring / chip-lied / scrollback-hid / canary-kept / quoted-tag / false-banner / render-only / no-truncate / envelope-miss.
5. Paste or drop a ticket JSON and score the pane.
6. Inspect a session JSONL snippet; type a quoted tag into the substring predicate.

## How to score

Open `projects/trompe/index.html` in a browser, or serve the repo root and visit `/trompe/` (Vercel rewrite → `/projects/trompe`). No build step. Optional hook:

```bash
node projects/trompe/hook/trompe.mjs < projects/trompe/data/90881.json
node projects/trompe/hook/trompe.mjs projects/trompe/data/intact.json
node --test projects/trompe/hook/trompe.test.mjs
```

Phantom seed → phantom/alarm. Intact seed → intact/hold.

`projects/trompe/hook/trompe.mjs` scores a probe ticket `{ quotedTag, leadingSlash, hasEnvelope, chipPainted, bannerShown, scrollbackCollapsed, jsonlContinuous, canaryRecalled, actualClear }` and returns `{ verdict, chips[], reasons[], intact, phantom, hold, alarm, idleWord }`. See `hook/README.md`.

Local fingerprints: `data/90881.json`, `data/phantom.json`, `data/intact.json`, plus one JSON per other verdict, `data/fingerprints.json`, `data/chips.json`. Evidence only from issue facts.

## Native integrations

1. GitHub fetch of [anthropics/claude-code#90881](https://github.com/anthropics/claude-code/issues/90881). Unauthenticated. See `.env.example`.
2. JSONL parse of a session transcript (`~/.claude/projects/…/*.jsonl`) for the quoted tag and planted canary.
3. Substring predicate: type ordinary text that quotes the command-name tag; watch the desktop renderer paint a chip.
4. Canary recall after the painted clear (`CANARY-TROMPE-88`; issue used `PATINA-7731-OBSIDIAN`).
5. Envelope-miss check: no leading-slash / command envelope / author-role gate.

## Sources

- [anthropics/claude-code#90881](https://github.com/anthropics/claude-code/issues/90881) OPEN
- Same-class (cite, not primary): [#53715](https://github.com/anthropics/claude-code/issues/53715) CLOSED VSCode phantom `/clear` autocomplete; [#88367](https://github.com/anthropics/claude-code/issues/88367) `/clear` drops session name. Cross-ecosystem: [openai/codex#41758](https://github.com/openai/codex/issues/41758) UI/journal lie; [openai/codex#41748](https://github.com/openai/codex/issues/41748) success UI nothing persisted.
