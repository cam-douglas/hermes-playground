# Palimpsest

A scriptorium **parchment scraper's desk** — cream folio, iron-gall ink, oxblood seals, candle-amber clock, undertext ghost, rewrite stylus — for a real Claude Code defect: PreToolUse `hookSpecificOutput.updatedInput` is applied as a **whole replacement** of the tool input, not a merge/patch. A hook that naturally rewrites only `command` silently drops every sibling field the model passed (`timeout`, `run_in_background`, `description`). The transcript still shows the model's `timeout: 600000`, but the command is SIGTERMed at the 120s default (`Command timed out after 2m 0s`, exit 143) with no indication the timeout was lost.

Primary: [anthropics/claude-code#90725](https://github.com/anthropics/claude-code/issues/90725) (OPEN, filed 2026-08-30). Title: PreToolUse updatedInput replaces the whole tool input — sibling fields (timeout, run_in_background) silently dropped. Labels: bug, has repro, platform:windows, area:bash, area:hooks. Observed on Claude Code 2.1.251, Windows Git Bash. Binary string noted: "updatedInput is missing or empty, falling back to original tool input" (when present, used whole).

A scraped page is not a holding. Score the undertext or admit **underwrit**.

Idle word: **underwrit** (honest control: hook returns merged/full tool_input, siblings preserved, timeout honored).
NEVER use underwrit for a failure. NEVER use the product name palimpsest / plated / collated / unheard / passed / squared / bound / girt / sheltered / alongside / seated / credited / level / verbatim / fronted / locked / yanked / caught / posted / bunged / belayed / rove / keyed / housed / beamed / snug / hung / appointed / cinched / gauged / stamped / overrun / pratique / wound / fit / spoilt / laid / unlinked / tight / banked / roosted / stocked / heard / clear / paired / empty / mute / idle / silent as the idle/state word.

Verdicts: **underwrit**, **scraped**, **sibling-lost**, **timeout-killed**, **bg-dropped**, **partial-write**, **transcript-lies**, **post-rewrite-cliff**, **merged-keeps**.

- **underwrit** = idle / honest control (full merge or full copy+override command only; timeout + run_in_background preserved; command completes or auto-backgrounds as model intended)
- **scraped** = #90725 primary failure: command-only updatedInput → whole replace → siblings gone
- **sibling-lost** = timeout / run_in_background / description absent after rewrite
- **timeout-killed** = dies at 2m default exit 143 despite model timeout in transcript
- **bg-dropped** = run_in_background silently lost
- **partial-write** = hook authored only `{command}`
- **transcript-lies** = assistant tool_use still shows timeout while runtime used default
- **post-rewrite-cliff** = same-class #90726: canAutoBackground evaluated on post-rewrite shape; `; exit "${PIPESTATUS[0]}"` rewrite strips auto-background eligibility → killed at 2m instead of backgrounded
- **merged-keeps** = contrast seed: hook copied full tool_input and overrode only command → timeout honored (control that proves merge would fix)

The #90725 scraped board (command-only `updatedInput` + siblings gone + 2m SIGTERM while the transcript still shows `timeout: 600000`) is **scraped**, never **underwrit**. Unique nearby flags win their own seeds. Admit does not lie: a scraped probe stays scraped.

## Why not a clone

NOT **Spile** — hook stdin wedge / unenforced timeout ([#90585](https://github.com/anthropics/claude-code/issues/90585)). Different: stdin hang, not field drop.
NOT **Tappet** — silent hook injection ([#90296](https://github.com/anthropics/claude-code/issues/90296)).
NOT **Ambo** — PermissionRequest systemMessage never rendered on ExitPlanMode card ([#90685](https://github.com/anthropics/claude-code/issues/90685)).
NOT **Quoin** — quoted-heredoc unescape inside Bash ([#90630](https://github.com/anthropics/claude-code/issues/90630)).
NOT **Gaff** — timeout-kill reported completed exit 0 ([#90616](https://github.com/anthropics/claude-code/issues/90616)). Opposite of silent timeout loss (false success vs silent drop).
NOT **Escutcheon** — Linux `/run/user` tmpfs D-Bus mask ([#90717](https://github.com/anthropics/claude-code/issues/90717)).
NOT **Lacuna** — task store scrape ([#90709](https://github.com/anthropics/claude-code/issues/90709)).

Different problem: whole-input replacement of `updatedInput` drops siblings.
Different UI: scriptorium parchment desk, scraped folio, iron gall ink, undertext ghost, rewrite stylus, timeout candle clock. Cormorant Garamond + Source Serif 4 + IBM Plex Mono. Not brass/gunmetal locksmith, not oak/vellum collation, not a night pulpit.
Different idle word: **underwrit**.

## Live catalog path

`/palimpsest/` is this static scriptorium desk. Demo works with no secrets and no npm. Mark: `20:50 Sydney · palimpsest`.

1. Seeded `#90725` **scraped** is already on the desk: command-only rewrite + siblings gone + 2m SIGTERM → **scraped**. Never underwrit.
2. File **sibling-lost** — timeout / run_in_background / description absent after rewrite.
3. File **timeout-killed** — dies at 2m default exit 143 despite model timeout in the transcript.
4. File **bg-dropped** — `run_in_background` silently lost.
5. File **partial-write** — hook authored only `{command}`.
6. File **transcript-lies** — assistant tool_use still shows timeout; runtime used 120s.
7. File **post-rewrite-cliff** — `#90726` PIPESTATUS rewrite strips auto-background eligibility.
8. Contrast **merged-keeps** — full copy+override honors timeout. The fix #90725 needs.
9. **Stamp** the matching class. Wrong stamps bind the quill. **Admit underwrit** unlocks only on the honest folio (full merge, siblings preserved). **Restore · #90725** shows the scraped board.

## Hook

`projects/palimpsest/hook/` scores a probe transcript `{ originalInput, updatedInput, observedTimeoutMs, exitCode, autoBackgrounded, transcriptShowsTimeout }` and returns `{ verdict, reasons[], underwrit, alarm }`. See `hook/README.md`.

```bash
node projects/palimpsest/hook/index.mjs < transcript.txt
node --test projects/palimpsest/hook/palimpsest.test.mjs
```

`underwrit` is true ONLY when the verdict is underwrit (idle, or honest control: full merge or full copy+override command only; timeout + `run_in_background` preserved; command completes or auto-backgrounds as the model intended). Seeded 90725 numbers must produce scraped / `underwrit=false`.

## Evidence (do not invent more)

Primary:

- [anthropics/claude-code#90725](https://github.com/anthropics/claude-code/issues/90725) — OPEN, filed 2026-08-30. PreToolUse `updatedInput` replaces the whole tool input. Sibling fields (`timeout`, `run_in_background`) silently dropped. Labels: bug, has repro, platform:windows, area:bash, area:hooks. Claude Code 2.1.251 Windows Git Bash. Binary: "updatedInput is missing or empty, falling back to original tool input" (when present, used whole).

Same-class / nearby (cite as same-class or nearby, not other products):

- [anthropics/claude-code#90726](https://github.com/anthropics/claude-code/issues/90726) — auto-background eligibility evaluated post-rewrite; hook-rewritten long commands killed at 2m instead of backgrounded.
- [anthropics/claude-code#77851](https://github.com/anthropics/claude-code/issues/77851) — PostToolUse cannot recover original `tool_input` after PreToolUse `updatedInput` rewrite.
- [anthropics/claude-code#83353](https://github.com/anthropics/claude-code/issues/83353) — multi-hook `updatedInput` race by completion order.
- [anthropics/claude-code#79321](https://github.com/anthropics/claude-code/issues/79321) — `updatedInput` silently ignored for Bash (distinct pole: ignored vs whole-replace).

Cross-ecosystem:

- [openai/codex#35713](https://github.com/openai/codex/issues/35713) — PreToolUse `updatedInput` resolution depends on handler completion timing.
- [openai/codex#33986](https://github.com/openai/codex/issues/33986) — Bash PreToolUse `tool_input` drops honored per-call workdir.

Suggested consumer fix: implement `updatedInput` as merge-over-original unless the hook explicitly nulls a field; optionally warn on partial `updatedInput` that only names `command`.

## Env

| Variable | Meaning |
| --- | --- |
| `PALIMPSEST_SLACK_WEBHOOK` / `SLACK_WEBHOOK` | Unused at page runtime. Absent → honest demo. |
| `PALIMPSEST_GITHUB_TOKEN` / `GITHUB_TOKEN` | Unused at page runtime. |

Missing secrets stay in honest demo mode. The static page does not need them.
