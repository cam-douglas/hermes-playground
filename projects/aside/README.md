# Aside

Theatrical side-channel / wing desk for Claude Code `/btw` silent truncation. A preamble is not an answer. Score the side channel or admit **heard**.

When the side agent inherits tool-first context — a project `CLAUDE.md` or a `SessionStart` hook saying it must call a tool before ANY response — but `/btw` forbids tools, the model emits a short preamble (`Let me check that file.`) then the exchange ends with NO answer and NO notice. The existing CLI notice about trying to call a tool instead of answering only fires when the response has ZERO text. Any preamble suppresses it and is presented as the complete answer. Truncated turns poison subsequent `/btw` in that session (sticky all-or-nothing). `/btw` exchanges are never written to the session transcript, so users cannot self-diagnose.

Idle word: **heard** (real side answer landed; wing quiet).
Never use the product name aside as the idle/state word.

Verdicts: **heard**, **preamble**, **muted**, **poisoned**, **toolish**, **inherited**, **ghost**, **sticky**, **noticed**, **forked**. Slack alarm on preamble / muted / poisoned / toolish / inherited / ghost / sticky / forked. Linear ticket on preamble / poisoned. GitHub aside-ledger issue on every scored probe.

## Why not a clone

NOT Coda (silent dropped assistant text in the MAIN turn).
NOT Suture (stream-tear / partial MAIN turn).
NOT Chute (secret handoff inbound). NOT Scrim (outbound DLP).
NOT Knock, Quench, Hasp, Parity, Reveille, Reed, Fathom, Blot, Stencil, Sigil, Wicket, Assay, Veto, Snib, Husk, Tain.
NOT any leftover woodworking product.

Different problem: side-channel `/btw` tool-forbidden inheritance + notice-gated-on-empty-text + sticky poison + ghost transcript.
Different UI: theatre wing / side-stage whisper booth. Velvet burgundy, footlight gold, stage black, soft wing curtain.
Different idle word: **heard**.

## Live catalog path

`/aside/` is this static theatre wing. Velvet burgundy, footlight gold, stage black, soft wing curtain. Demo works with no secrets and no npm.

1. Seeded `#90314` **preamble** is already in the booth: `Let me check that file.` then silent end → **preamble**.
2. Switch **heard** — real side answer landed; wing quiet → **heard** (idle).
3. Switch **muted** — any text suppressed the tool-notice → **muted**.
4. Switch **poisoned** — prior truncation in `btwHistory`; later `/btw` also fails → **poisoned**.
5. Switch **toolish** — model attempted a tool in the side channel → **toolish**.
6. Switch **inherited** — tool-first CLAUDE.md / SessionStart infected the wing → **inherited**.
7. Switch **ghost** — `skipTranscript: true`; no `/btw` artifact → **ghost**.
8. Switch **sticky** — session-wide all-or-nothing → **sticky**.
9. Switch **noticed** — zero-text path correctly showed the tool-notice → **noticed**.
10. Switch `#86108` **forked** — fork on completed `/btw` re-submits original → **forked**.
11. **Ask** submits a `/btw`. Inherited tool-first context produces preamble; a quiet wing produces heard. **Score** names the class. **Admit heard** does not lie. **Clear** empties the wing to the idle word.

## Hook

`projects/aside/hook/` scores a probe `{ channel, preambleText, silentEnd, toolsForbidden, inheritedToolFirst, noticeSuppressed, skipTranscript, … }` and returns `{ verdict, reasons[], feed }`. See `hook/README.md`.

```bash
node projects/aside/hook/index.mjs --listen 9314
node --test projects/aside/hook/aside.test.mjs
```

## Evidence (do not invent more)

Primary:

- [anthropics/claude-code#90314](https://github.com/anthropics/claude-code/issues/90314) — `/btw` side question ends silently after a short preamble when the model attempts a tool call — no answer, no notice, and the truncated turn poisons subsequent side questions

Corroboration:

- [anthropics/claude-code#79593](https://github.com/anthropics/claude-code/issues/79593) — `/btw` silently ineffective; submitted content is lost, not executed or persisted
- [anthropics/claude-code#85674](https://github.com/anthropics/claude-code/issues/85674) — keep a log of `/btw` messages; they do not reach disk or the terminal buffer
- [anthropics/claude-code#81736](https://github.com/anthropics/claude-code/issues/81736) — `/btw` side-channel explanations the main session cannot see, verify, or correct
- [anthropics/claude-code#89294](https://github.com/anthropics/claude-code/issues/89294) — terminal shows 'done working' on a `/btw` that has not answered
- [anthropics/claude-code#86108](https://github.com/anthropics/claude-code/issues/86108) — `/btw` → f creates a fork subagent and re-executes the already-answered question
- [anthropics/claude-code#87156](https://github.com/anthropics/claude-code/issues/87156) — fork on completed `/btw` re-submits the original prompt
- [anthropics/claude-code#83292](https://github.com/anthropics/claude-code/issues/83292) — interrupted `/btw` queries not saved to history when Esc is pressed during the response
- [anthropics/claude-code#74959](https://github.com/anthropics/claude-code/issues/74959) — interacting with the btw section auto-rejects a pending AskUserQuestion; Esc leaks to the main thread
