# Quoin

Letterpress quoin — the expanding wedge that locks type into a chase so the form cannot shift — for a real Claude Code failure: **the Bash tool applies one level of backslash-unescaping to the body of a *quoted* heredoc (`<<'EOF'`) before the shell sees it.** POSIX requires a quoted delimiter to suppress all expansion and processing, so the body should arrive verbatim. Actual: `\\` collapses to `\`; `\U` is left alone. That is a single unescape pass. The failure is misattributed: a Python heredoc with `s = "C:\\Users\\Scott"` raises a unicodeescape SyntaxError that points at a source line the model never wrote. The natural response is to rewrite the Python, which cannot help. On Windows every absolute path carries backslashes; regexes with `\\` and `\d` are affected the same way.

Primary: [anthropics/claude-code#90630](https://github.com/anthropics/claude-code/issues/90630) (open, filed 2026-08-29, labels bug/has repro/platform:windows/area:bash). Title: Bash tool unescapes backslashes inside a quoted heredoc. Repro as a single Bash tool call:

```
cat <<'EOF'
one:  C:\Users
two:  C:\\Users
EOF
```

Expected: one keeps one backslash, two keeps two. Actual: both print one backslash (two collapsed). Piped into Python: `s = "C:\\Users\\Scott"` raises SyntaxError unicodeescape truncated `\UXXXXXXXX` — traceback points at a line the model did not write. Workarounds verified: build separator with `chr(92)`; PowerShell single-quoted here-string `@'...'@` unaffected; forward slashes.

A shifted form is not a hold. Score the chase or admit **locked**.

Idle word: **locked** (the quoted delimiter held; body arrived verbatim; no unescape pass; form did not shift).
NEVER use the product name quoin / empty / silent / mute / idle / dead / sealed as the idle/state word.
NEVER reuse prior idles: posted, bunged, belayed, rove, keyed, housed, beamed, snug, hung, appointed, cinched, gauged, stamped, overrun, pratique, wound, bound, stilled, stabled, drained, flat, fit, spoilt, laid, unlinked, tight, banked, roosted, stocked, seated, heard, clear, paired, kernel, latched, upheld, sterling, home, valid, dry, sealed, quiet, seised, rung, moored, stowed, caught, yanked.

Verdicts: **locked**, **shifted**, **collapsed**, **unescaped**, **misattributed**, **path-broke**, **regex-broke**, **double-slash**, **sealed-open**. Slack alarm on shifted / collapsed / misattributed / path-broke / regex-broke. Linear ticket on shifted / misattributed. GitHub quoin-ledger of scored probes on every score.

The #90630 shifted chase (quoted delimiter + one unescape pass that collapses `\\` to `\`) is **shifted**, never **locked**. Unique nearby flags win their own seeds because those seeds do not carry the shifted pair.

## Why not a clone

NOT **Scant** — PATH truncation / working-size coil adjacent. Quoin is unescape of a quoted heredoc body.
NOT **Sear** (#90611) — set -e structurally inert in eval/non-final `&&`. Quoin is not about errexit.
NOT **Grille** (#90599) — permission-mode steers edits to Bash sed/heredocs so diffs vanish. Quoin is about the body arriving mutated *inside* an already-quoted heredoc, not about which tool was chosen.
NOT **Assay** — tool-arg wire-format. Quoin is Bash transport unescaping.
NOT **Stencil** — plan-mode fence. Quoin is not a plan fence.
NOT **Gaff** (#90616) — timeout-kill false complete. Quoin is not about exit receipts.
NOT **Spile** / **Sounder** / **Leat** — stdin wedge / missed wakeup / until-loop.
Do NOT ship leftover woodworking / millimetre-slider clones.
Do NOT ship alternate names Bodkin, Chase, Galley, Slug, Wafer, Cachet, Escaper, Heredoc, Quote. Product name is **Quoin** only.

Different problem: BASH TOOL APPLIES ONE UNESCAPE PASS TO A QUOTED HEREDOC BODY → COMPOSED TEXT ≠ SHELL BODY.
Different UI: letterpress **composing room** — oak chase, type-metal grey, brass expanding quoin + quoin key, ink slab, cream proof sheet. Composed form vs received proof. Fonts: Bodoni Moda + Roboto Mono.
Different idle word: **locked**.

## Live catalog path

`/quoin/` is this static letterpress quoin desk. Ink-black, paper-cream, brass quoin, type-metal grey, oak chase. Demo works with no secrets and no npm. Mark: `05:50 Sydney · quoin`.

1. Seeded `#90630` **shifted** is already on the chase: composed `two: C:\\Users`, received `two: C:\Users`, quoted `<<'EOF'` → **shifted**. Never locked.
2. Switch **#88561 collapsed** — command-text `\\` → `\` without a quoted heredoc pair.
3. Switch **#89392 strip** / **#85856 halve** — Windows/Git Bash path backslashes corrupted.
4. Switch **honest locked** — quoted heredoc body arrives verbatim → **locked** true.
5. Switch **PowerShell `@'...'@`** — here-string control also **locked**.
6. Switch misattributed / regex-broke / double-slash / unescaped / sealed-open.
7. **Score** scores. **Admit locked** scores honestly. **Restore · #90630** shows the shifted chase. Admit does not lie.

## Hook

`projects/quoin/hook/` scores a probe `{ composedBody, receivedBody, delimiterQuoted, tool, platform, traceback, issue }` and returns `{ verdict, reasons[], locked }`. See `hook/README.md`.

```bash
node projects/quoin/hook/index.mjs --listen 9090
node --test projects/quoin/hook/quoin.test.mjs
```

`locked` is true ONLY when composed === received (verbatim) under a quoted delimiter, OR when the PowerShell here-string / no-unescape control holds, and the verdict is not a failure class. Seeded 90630 numbers must produce shifted / `locked=false`. Control verbatim / PowerShell path produces `locked=true`.

## Evidence (do not invent more)

Primary:

- [anthropics/claude-code#90630](https://github.com/anthropics/claude-code/issues/90630) — open, filed 2026-08-29, labels bug/has repro/platform:windows/area:bash. Title: Bash tool unescapes backslashes inside a quoted heredoc.

Same class:

- [anthropics/claude-code#88561](https://github.com/anthropics/claude-code/issues/88561) — open, 2026-08-21. Bash tool silently collapses `\\` to `\` in command text, corrupting regex and paths.
- [anthropics/claude-code#89392](https://github.com/anthropics/claude-code/issues/89392) — open, 2026-08-25. Bash tool silently strips backslashes on Windows/Git Bash.
- [anthropics/claude-code#85856](https://github.com/anthropics/claude-code/issues/85856) — open, 2026-08-11. Windows/Git Bash: Bash tool silently halves backslashes in commands (MSVCRT vs MSYS2 command-line encoding mismatch).

Nearby pole (different tool, do not treat as the same bug):

- [anthropics/claude-code#72957](https://github.com/anthropics/claude-code/issues/72957) — Write/Edit tools silently decode `\uXXXX` in file content. Quoin is Bash-tool transport into a quoted heredoc, not Write/Edit.

Nearby (not this):

- [anthropics/claude-code#90597](https://github.com/anthropics/claude-code/issues/90597) — File-write directive prescribes heredocs without gating on platform — platform heredoc breakage, not unescape of a correctly quoted body.

Cross-check nearby bugs are DIFFERENT (cite only as “not this”):

- NOT Scant. PATH truncation / working-size coil adjacent.
- NOT Sear. set -e structurally inert in eval/non-final `&&`.
- NOT Grille. Permission-mode steers edits to Bash sed/heredocs so diffs vanish.
- NOT Assay. Tool-arg wire-format.
- NOT Stencil. Plan-mode fence.
- NOT Gaff. Timeout-kill false complete.

Cross-ecosystem (composed text ≠ executed text):

- [openai/codex#41534](https://github.com/openai/codex/issues/41534) — nested-quote corruption in pwsh `-Command`; intended body mangled before the shell sees it. Different mechanism, same class of lie.

## Integrations

Slack alarm on shifted / collapsed / misattributed / path-broke / regex-broke. Linear ticket on shifted / misattributed. GitHub quoin-ledger of scored probes on every score. Demo mode needs no Slack / GitHub / Linear secrets and no npm. Native stubs fire in the UI (ledger tape / alarm card) without requiring live tokens.
