# Pawl

A machine-shop **ratchet pawl** — brass tooth, steel wheel, oil-stained bench, tungsten lamp, amber CRT debug strip — for a real Claude Code defect: **UserPromptSubmit hooks permanently stop firing for a session**, correlated with a **duplicate `generate_session_title` request**. Hook scripts still run and the extension host log says they "provided additionalContext," but `hookSpecificOutput` never appears in the session transcript. SessionStart / PreToolUse / PostToolUse / Stop keep working. Sticky for the whole session lifetime.

Primary: [anthropics/claude-code#90784](https://github.com/anthropics/claude-code/issues/90784) (OPEN, filed 2026-08-30T16:00:44Z). Title: UserPromptSubmit hooks permanently stop firing for a session, correlated with a duplicate `generate_session_title` request. Labels: bug, has repro, platform:macos, platform:vscode, area:hooks. Env: Claude Code 2.1.247, `claude-vscode` on macOS; four specimens among ~30 concurrent sessions; one session ran 999 PreToolUse and 17 Stop with zero UserPromptSubmit.

A tooth that caught the wrong stroke is not a hold. Score the ratchet or admit **engaged**.

Idle word: **engaged** (honest control: a single `generate_session_title`; UserPromptSubmit fires; `hookSpecificOutput` lands in the transcript).
NEVER use engaged for a failure. NEVER use the product name or these prior idle words: stood, muted, liveried, penned, underwrit, plated, collated, unheard, passed, squared, bound, girt, sheltered, alongside, seated, credited, level, verbatim, fronted, locked, yanked, caught, posted, bunged, belayed, rove, keyed, housed, beamed, snug, hung, appointed, cinched, gauged, stamped, overrun, pratique, wound, fit, spoilt, laid, unlinked, tight, banked, roosted, stocked, heard, clear, paired, empty, mute, idle, silent, flat, kernel, valid, sealed, dry, intact, open, still, loose, even, quiet, cool, latched, upheld, sterling, home.

Verdicts: **engaged**, **doubled-title**, **first-turn-race**, **sticky-delivered**, **context-orphaned**, **other-hooks-fine**, **transcript-blank**, **log-said-sent**, **no-user-error**, **session-lifetime**, **attachment-different**, **pale-not-this**.

- **engaged** = idle / honest ratchet: UserPromptSubmit fires and hookSpecificOutput lands
- **doubled-title** = #90784 primary: two `generate_session_title` requests within ~100ms
- **first-turn-race** = title generation races the first real turn for hook-context attachment
- **sticky-delivered** = session marked already-delivered; later turns never retry
- **context-orphaned** = additionalContext generated and logged, never reaches the model
- **other-hooks-fine** = SessionStart / PreToolUse / PostToolUse / Stop keep working
- **transcript-blank** = hookSpecificOutput never appears in the session transcript
- **log-said-sent** = extension host log says the script provided additionalContext
- **no-user-error** = Claude Code UI shows no error, warning, or miss
- **session-lifetime** = UserPromptSubmit stays dead for the whole session
- **attachment-different** = nearby #85669 skips UserPromptSubmit on attachment — not a doubled title
- **pale-not-this** = Pale #90683 is hooks never loading because project root ≠ repo root

The seeded #90784 board (doubled title + script ran + log said sent + transcript blank + UPS = 0) is **doubled-title**, never **engaged**. Unique nearby flags win their own seeds. Admit does not lie: a jammed probe stays jammed.

## Why not a clone

Different problem: UserPromptSubmit delivery races a duplicate `generate_session_title` on the first turn, then sticks "already delivered" for the session. Hooks *do* load and *do* run; the output is orphaned. Other hook events keep firing.

NOT **Pale** ([#90683](https://github.com/anthropics/claude-code/issues/90683)) — hooks never load because session project root ≠ repo root.
NOT **Ambo** ([#90685](https://github.com/anthropics/claude-code/issues/90685)) — PermissionRequest systemMessage accepted but never rendered on the ExitPlanMode card.
NOT **Cotter** ([#90533](https://github.com/anthropics/claude-code/issues/90533)) — poison fireAt registry.
NOT **Fetch** ([#90755](https://github.com/anthropics/claude-code/issues/90755)) — TUI ghost suggestion text.
NOT **Cenotaph** ([#90771](https://github.com/anthropics/claude-code/issues/90771)) — orphaned `advisor_tool_result` after away/return re-assembly.

Nearby-but-different (cite, do not treat as primary):

- [anthropics/claude-code#85669](https://github.com/anthropics/claude-code/issues/85669) — UserPromptSubmit skipped on attachment
- [anthropics/claude-code#55951](https://github.com/anthropics/claude-code/issues/55951) — sidebar ignores sessionTitle output
- [anthropics/claude-code#86413](https://github.com/anthropics/claude-code/issues/86413) — hook systemMessage leaks into chat UI

Cross-ecosystem shape (same class of "hooks detected, delivery skipped"):

- [openai/codex#35863](https://github.com/openai/codex/issues/35863) — SessionStart hooks detected but command hooks never execute
- [openai/codex#34694](https://github.com/openai/codex/issues/34694) — async hooks skipped

Different UI: night machine-shop / clockwork ratchet bench / brass pawl tooth / steel wheel / oil stains / tungsten lamp / amber CRT debug strip showing the doubled `[DEBUG] [API REQUEST] ... source=generate_session_title`. Archivo Black + Figtree + Red Hat Mono. NOT Portland-stone memorial (Cenotaph Cinzel/Fraunces), NOT looking-glass parlor (Fetch), NOT household wardrobe (Livery), NOT village pound (Pinfold), NOT scriptorium (Palimpsest), NOT Tudor pale, NOT pulpit (Ambo), NOT cotter-pin tray (Cotter Big Shoulders Stencil), NOT overrunning clutch (Sprag Teko).
Different idle: **engaged**.

## Live catalog path

`/pawl/` is this static ratchet bench. Demo works with no secrets and no npm. Mark: `01:50 Sydney · pawl`.

1. Seeded `#90784` **doubled-title** is already on the tooth: two `generate_session_title` within ~100ms + hook script ran + log said sent + `hookSpecificOutput` blank → **doubled-title**. Never engaged.
2. File **first-turn-race** — title generation races the first real turn.
3. File **sticky-delivered** — session marked already-delivered.
4. File **context-orphaned** — additionalContext logged, never reaches the model.
5. File **other-hooks-fine** — SessionStart / PreToolUse / PostToolUse / Stop keep working.
6. File **transcript-blank** — hookSpecificOutput absent from the transcript.
7. File **log-said-sent** — host log: provided additionalContext.
8. File **no-user-error** — UI silent.
9. File **session-lifetime** — UPS stays dead for the session.
10. File **attachment-different** — nearby #85669.
11. File **pale-not-this** — Pale #90683 is a different fence.
12. **Score** the pawl. Wrong stamps bind the tooth. **Admit engaged** unlocks only on the honest ratchet. **Restore · #90784** shows the jammed board.

## How to run (static)

Open `projects/pawl/index.html` in a browser, or serve the repo root and visit `/pawl/` (Vercel rewrite → `/projects/pawl`). No build step. Optional hook:

```bash
node projects/pawl/hook/index.mjs < projects/pawl/data/90784.jsonl
node --test projects/pawl/hook/pawl.test.mjs
```

`engaged` is true ONLY when the verdict is engaged (idle, or honest control: single title request; UserPromptSubmit fires; hookSpecificOutput in the transcript). Seeded 90784 numbers must produce doubled-title / `engaged=false` / alarm true.

## Hook

`projects/pawl/hook/` scores a probe `{ doubledTitleRequest, titleRequestCount, userPromptSubmitFired, userPromptSubmitCount, hookScriptRan, logSaidAdditionalContext, hookSpecificOutputInTranscript, otherHooksFine, preToolUseCount, stopCount, firstTurnRace, stickyDelivered, nearbyAttachmentSkip, nearbyPaleRoot }` and returns `{ verdict, reasons[], engaged, alarm }`. See `hook/README.md`. Seed JSONL: `data/90784.jsonl`.

## Evidence (do not invent more)

Primary:

- [anthropics/claude-code#90784](https://github.com/anthropics/claude-code/issues/90784) — OPEN, filed 2026-08-30T16:00:44Z. Four specimens; Claude Code 2.1.247; `claude-vscode` on macOS. Doubled `generate_session_title` within ~100ms in the extension host log; 1:1 with missing UserPromptSubmit for the session lifetime. Hook scripts run and log "provided additionalContext"; `hookSpecificOutput` never in the transcript. SessionStart / PreToolUse / PostToolUse / Stop continue. No user-visible error.

Nearby (cite, not primary): [#85669](https://github.com/anthropics/claude-code/issues/85669), [#55951](https://github.com/anthropics/claude-code/issues/55951), [#86413](https://github.com/anthropics/claude-code/issues/86413). Cross-ecosystem: [openai/codex#35863](https://github.com/openai/codex/issues/35863), [openai/codex#34694](https://github.com/openai/codex/issues/34694).

Ask: serialize hook-context attachment against concurrent title-generation requests, or retry UserPromptSubmit on the next turn if delivery was not confirmed.

## Env

| Variable | Meaning |
| --- | --- |
| `PAWL_SLACK_WEBHOOK` / `SLACK_WEBHOOK` | Unused at page runtime. Absent → honest demo. |
| `PAWL_GITHUB_TOKEN` / `GITHUB_TOKEN` | Unused at page runtime. |
| `PAWL_LINEAR_KEY` / `LINEAR_API_KEY` | Unused at page runtime. |

Missing secrets stay in honest demo mode. The static page does not need them.
