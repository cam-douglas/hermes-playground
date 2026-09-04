# Forme

A **letterpress imposing-stone / locked-forme scoring desk** — ink-black stone, lead-type gray, chase brass, tympan cream, makeready scrap — Literata + Sora + IBM Plex Mono — for a real Claude Code TUI defect: **COMPLETED TURNS REPAINTED IN PLACE → TERMINAL SCROLLBACK LOSES THE RECENT CONVERSATION; AREA:TUI; PLATFORM:LINUX.**

Primary:

- [anthropics/claude-code#92203](https://github.com/anthropics/claude-code/issues/92203) (OPEN, bug, platform:linux, area:tui, filed 2026-09-04T20:02:41Z, updated 2026-09-04T20:04:00Z). Title: `Completed turns are repainted, so terminal scrollback loses the recent conversation`. Reporter yiidtw. Claude Code 2.1.260 · tmux 3.4 · `TERM=tmux-256color` · Linux 6.8. Scrolling up in a multiplexer does not show the last several exchanges. Older output remains; then a gap where the recent conversation should be. The TUI redraws its output region in place rather than emitting a linear stream. Scrollback only retains what genuinely scrolled off the top, so anything overwritten by a later impression is gone. The last handful of turns is the part most likely wiped. `/resume` renders through the same TUI. `tmux pipe-pane` captures the repaints, not a transcript. Session JSONL under `~/.claude/projects/<slug>/<session-id>.jsonl` is complete and written live, but there is no discoverable path from “re-read five messages ago” to that file, and the format is not documented as stable. Reporter suggests commit each completed turn as ordinary scrolled lines and repaint only the live region at the bottom. If the UI is Ink-based — the bundled binary contains `measureElement`, `useStdout`, `useInput` — Ink’s `<Static>` writes children once, permanently, above the dynamic area. Treat that as a suggestion, not a diagnosis of unseen source.

a forme that keeps finished type in the live chase so every impression reprints over the last turns is not locked stone — it is a forme already wiped. Score the forme or admit the chase already wiped.

Idle word: **locked**. Seeded state: **wiped** / #92203 — completed turns stay in the dynamic region; later repaints erase them from scrollback. Never idle as seated / channel / stranded / scratched / live / orphaned / set / scrapped / pure / scorched / cold / voided / banked / rewritten / keyed / strayed / scrubbed / pulled / enacted / withheld / masked / bled / fouled / careted.

**Forme** is a locked letterpress chase on an imposing stone: finished type is locked once, then only the live chase takes another impression. Leaving finished type in the live chase means every reprint wipes the last turns.

- **locked** = HOLD: completed turns committed to native scrollback; only the live region repaints
- **wiped** = #92203: completed turns stay in the dynamic region; later frames erase them
- **repaint** = TUI redraws the output region in place
- **static-commit** = finished turns written once, permanently, above the live chase
- **scrollback-gap** = older output remains; recent conversation is missing
- **jsonl-intact** = session JSONL is complete and written live, but undiscoverable
- **tmux-copy-mode** = copy-mode scroll shows the gap, not the last turns
- **live-region** = only the bottom interactive region should reprint
- **completed-turn** = a finished exchange that will never change again
- **ink-hint** = binary contains `measureElement` / `useStdout` / `useInput`; `<Static>` suggested
- **pipe-pane** = `tmux pipe-pane` captures repaints, not a transcript
- **resume-same-tui** = `/resume` renders through the same TUI

Verdicts: locked, wiped, repaint, static-commit, scrollback-gap, jsonl-intact, tmux-copy-mode, live-region, completed-turn, ink-hint, pipe-pane, resume-same-tui.

This is a diagnostic scoring desk. Not an exploit. No payloads. No real credentials. Score whether the forme locked finished type onto the stone or the chase already wiped. Fixtures use fictionalized paths (`~/.claude/projects/<demo-slug>/<session-id>.jsonl`).

Hypothesis only (NON-BINDING): completed turns stay in the dynamic Ink region instead of `<Static>`, so later frames erase them from scrollback. Discard if evidence disagrees. Encoded from the issue’s mechanism, workarounds, and Ink hint. Do not claim unseen source.

## Why not a clone

This is specifically: **COMPLETED TURNS REPAINTED IN PLACE → TERMINAL SCROLLBACK LOSES THE RECENT CONVERSATION; AREA:TUI; PLATFORM:LINUX.**

NOT Tabula ([#92210](https://github.com/anthropics/claude-code/issues/92210)) — desktop deep-link same-folder scratch mint.
NOT Oxbow ([#92197](https://github.com/anthropics/claude-code/issues/92197)) — transcript forest largest≠newest.
NOT Relict ([#92173](https://github.com/anthropics/claude-code/issues/92173)) — versioned WindowsApps Run path orphan.
NOT Hellbox ([#92168](https://github.com/anthropics/claude-code/issues/92168)) — sticky CLAUDE_PROJECT_DIR ENOENT erase.
NOT Palimpsest / Lacuna / Quoin UIs.
NOT a general scrollback-viewer clone.

Different surface: TUI completed-turn commit vs desktop deep-link / transcript forest / packaging / hooks. Completely different UI (imposing-stone / locked-forme desk — ink-black stone, lead-type gray, chase brass, tympan cream, makeready scrap), backend (probe-shaped JSON of lockup / wipe / repaint / static-commit / scrollback-gap rows), and UX (lockup simulator chips, locked/wiped state machine, workaround scraps).

Cousins are cite-only on a cousin strip; primary stays #92203.

- [#87450](https://github.com/anthropics/claude-code/issues/87450) — OPEN — Scrollback buffer cleared when streaming output arrives while user is scrolled up. Cite-only.
- [#76692](https://github.com/anthropics/claude-code/issues/76692) — OPEN — Streaming output trimmed live by prompt repaint. Cite-only.
- [#84247](https://github.com/anthropics/claude-code/issues/84247) — OPEN — TUI resize duplicates bands of already-emitted lines into scrollback. Cite-only.
- [#85508](https://github.com/anthropics/claude-code/issues/85508) — OPEN — Long responses corrupt terminal scrollback mid-stream. Cite-only.
- [#79896](https://github.com/anthropics/claude-code/issues/79896) — OPEN — Response text duplicated in scrollback; JSONL clean. Cite-only.
- [#88040](https://github.com/anthropics/claude-code/issues/88040) — OPEN — Inline TUI leaks blank rows on every frame shrink. Cite-only.
- [#85142](https://github.com/anthropics/claude-code/issues/85142) — OPEN — Background-conversation list truncates session scrollback. Cite-only.
- [#51828](https://github.com/anthropics/claude-code/issues/51828) — OPEN — Scrollback duplication on terminal resize persists. Cite-only.

Backups (document only, do not build): [#92194](https://github.com/anthropics/claude-code/issues/92194) (Catafalque — Remote Control archives live sessions after network give-up), [#92179](https://github.com/anthropics/claude-code/issues/92179) (Schism — sidebar sessions oscillate between folder-name vs git-remote-name groups), [#92219](https://github.com/anthropics/claude-code/issues/92219) (Miskey — VS Code session tab close button closes the other tabs).

Product name stays **Forme**. Do not rename to Tabula, Oxbow, Relict, Hellbox, Cupel, Oubliette, Ephemera, Commutator, Heddle, Hectograph, Placet, Frisket, Tangent, Hawser, Caret, Buoy, Solecism, Coffer, Codicil, Crimp, Jackfield, Tocsin, Bolter, Deadeye, Reglet, Reliquary, Annunciator, Caisson, Spindle, Knell, Tumbler, Escapement, Geneva, Scotch, Pintle, Palimpsest, Lacuna, Quoin, Flong or any existing catalog slug.

Different UI: imposing-stone / locked-forme desk + ink-black stone + lead-type gray + chase brass + tympan cream / makeready scrap. Literata + Sora + IBM Plex Mono. NOT Fraunces / Source Sans 3 (Tabula wax). NOT Crimson Pro / Work Sans / Space Mono (Oxbow). NOT Spectral / Manrope / JetBrains Mono (Relict). NOT Fraunces / DM Sans (Hellbox — melt, not lockup). Stay OFF Tabula wax tablet / Oxbow floodplain / Relict glacial fossil slab / Hellbox letterpress melt / Cupel assay office / Oubliette dungeon.

Different verbs: Score the forme, pin idle locked, pin seeded wiped, admit the chase already wiped, load fixtures, reset to locked. Score the forme is this desk’s phrase.

Different idle: **locked**.

## Live catalog path

`/forme/` is this static imposing-stone lockup desk. Path `https://hermes-playground-green.vercel.app/forme/` and subdomain `https://forme.hermes-playground-green.vercel.app` are both fine. Demo works with no secrets and no npm. Mark: `08:50 / hermes catalog #144 / #92203`. `?embed` or `?embed=1` hides chrome for the hub living featured well.

1. Seeded demo loads **wiped** — completed turns stay in the live chase; later frames reprint over them; tmux copy-mode shows older output then a gap; JSONL intact but undiscoverable; the forme is already wiped.
2. Idle **locked** → finished type committed once to native scrollback; only the live bottom region reprints; copy-mode still holds the recent conversation; the stone stays locked.
3. Imposing-stone UI: chase galleys for locked stone vs live chase, lockup/wipe state machine, workaround scraps. Locked = finished type on stone. Wiped = every impression reprints the last turns.
4. Cousin cite strip labeled cousin-not-primary: [#87450](https://github.com/anthropics/claude-code/issues/87450), [#76692](https://github.com/anthropics/claude-code/issues/76692), [#84247](https://github.com/anthropics/claude-code/issues/84247), [#85508](https://github.com/anthropics/claude-code/issues/85508), [#79896](https://github.com/anthropics/claude-code/issues/79896), [#88040](https://github.com/anthropics/claude-code/issues/88040), [#85142](https://github.com/anthropics/claude-code/issues/85142), [#51828](https://github.com/anthropics/claude-code/issues/51828). Cite only. Primary stays #92203.
5. **Score the forme** walks the probe ticket and lights chips on the stone. Chip-switch every verdict. Paste or drop JSON. Lockup simulator chips rewrite finished-type placement. Lockup machine steps compose → lock → impress → live → wipe.

## How to score

Open `projects/forme/index.html` in a browser, or serve the repo root and visit `/forme/` (Vercel rewrite → `/projects/forme`). No build step. Hook is a documentation stub only:

```bash
# No classifier binary. The living page scores probes in-browser.
# See projects/forme/hook/README.md
```

Empty paste scores the idle **locked** ticket if you pin idle. Paste a probe on the page or drop a fixture from `data/`. The living page seeds **wiped**.
