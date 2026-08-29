# Calque

Linguistic **calque** desk — a bilingual scriptorium where one Spanish lemma is wrongly glossed as a PowerShell verb — for a real Claude Code defect: **the PowerShell tool's protected-path / Remove-Item safety guard treats the Spanish word "del" (de+el contraction; also Catalan) inside a quoted commit message as the Remove-Item alias `del`, then extracts a delete target by whitespace-splitting without respecting quotes, so a fragment like `"C:\IA` (including the leading quote) is judged a protected system path and a plain `git commit` is blocked before execution.**

Primary: [anthropics/claude-code#90645](https://github.com/anthropics/claude-code/issues/90645) (OPEN, filed 2026-08-29, labels bug/has repro/platform:windows/area:sandbox). Title: PowerShell safety guard: Spanish word "del" inside a quoted commit message is treated as Remove-Item, then blocks on a quote-split path fragment. Deterministic repro:

```powershell
git -C "C:\IA Local\Produccion de Video" commit -m "prueba del guard"
```

Actual block: `Remove-Item on system path '"C:\IA' is blocked. This path is protected from removal.`

Controls from the issue: same command without "del" runs; same with "del" via the Bash tool runs; `commit -F msg.txt` with del in the file runs; init/add/push with the same quoted path run.

Quoted string content is not a command. Score the folio or admit **verbatim**.

Idle word: **verbatim** (quoted string content is not scanned as commands; hold is quiet).
NEVER use the product name calque / empty / silent / mute / idle / dead / sealed / fronted / locked / yanked / caught / stowed / posted / bunged / belayed / rove / keyed / housed / beamed / snug / hung / appointed / cinched / gauged / stamped / overrun / pratique / wound / bound / stilled / stabled / drained / flat / fit / spoilt / laid / unlinked / tight / banked / roosted / stocked / seated / heard / clear / paired / kernel / latched / upheld / sterling / home / valid / dry / quiet / seised / rung / moored as the idle/state word.

Verdicts: **verbatim**, **calqued**, **aliased**, **quote-blind**, **frag-quote**, **commit-blocked**, **bash-ok**, **path-lie**, **spanish-del**. Slack alarm on calqued / aliased / quote-blind / frag-quote / commit-blocked / path-lie / spanish-del. Linear ticket on calqued / spanish-del / commit-blocked. GitHub calque-ledger of scored probes on every score.

The #90645 calqued folio (PowerShell + Spanish del inside quotes + block with path starting with a quote) is **calqued** or **spanish-del**, never **verbatim**. Unique nearby flags win their own seeds because those seeds do not carry the calqued triad. Quote-split path starting with `"` → **frag-quote** / **path-lie**. Control without del → **verbatim**. Same command via Bash tool → **bash-ok**.

## Why not a clone

NOT **Visa** — MCP OAuth missing RFC 8707 resource.
NOT **Fob** — Keychain credential proliferation / split-brain.
NOT **Snib** / **Knock** / **Veto** — auth/permission classes.
NOT **Quoin** — Bash quoted-heredoc unescape.
NOT **Sear** / **Gaff** / **Grille** / **Spile** — Bash set -e / timeout-kill / steered edits / hook stdin.
NOT **Fascia** / **Wicket** / **Iota** — trust dialog / worktree / path-key.
Do NOT ship leftover woodworking / millimetre-slider clones.
Do NOT ship alternate names Frisk, Cognate, Gloss, Alias, Homograph, Delguard, Falsefriend. Product name is **Calque** only.

Different problem: PowerShell safety **parser** calques English `del` onto Spanish "del" inside quotes, then quote-blinds path extraction.
Different UI: scriptorium / translator's desk / bilingual manuscript with false gloss — parchment, iron-gall ink, one Spanish lemma wrongly glossed as Remove-Item. Fonts: IM Fell English + Red Hat Mono.
Different idle word: **verbatim**.

## Live catalog path

`/calque/` is this static bilingual scriptorium desk. Parchment, iron-gall ink, false gloss in the margin. Demo works with no secrets and no npm. Mark: `08:50 Sydney · calque`.

1. Seeded `#90645` **calqued** is already on the folio: PowerShell `git -C "C:\IA Local\Produccion de Video" commit -m "prueba del guard"` blocked on `'"C:\IA'` → **calqued**. Never verbatim.
2. Switch **spanish-del** — Spanish del inside quotes treated as Remove-Item, without the quote-frag triad.
3. Switch **aliased** — unquoted `del` / Remove-Item token scanned as the deletion alias.
4. Switch **quote-blind** — whitespace split without respecting quotes; fragment does not start with a quote.
5. Switch **frag-quote** — extracted path begins with `"`; tokenization already known to be wrong.
6. Switch **commit-blocked** — a plain git commit was denied before execution.
7. Switch **bash-ok** — same command with del via the Bash tool runs.
8. Switch **path-lie** — block claims a protected system path that is a fabricated fragment.
9. Switch **honest verbatim** — same quoted path, message without "del" → **verbatim** true.
10. **Score** scores. **Admit verbatim** scores honestly. **Restore · #90645** shows the calqued folio. Admit does not lie.

## Hook

`projects/calque/hook/` scores a probe `{ command, tool, messageText, quotedPaths[], blocked, blockMessage, platform, issue }` and returns `{ verdict, reasons[], verbatim }`. See `hook/README.md`.

```bash
node projects/calque/hook/index.mjs --listen 9090
node --test projects/calque/hook/calque.test.mjs
```

`verbatim` is true ONLY when the verdict is verbatim (idle, or honest control: no del / not blocked). Seeded 90645 numbers must produce calqued / `verbatim=false`. Honest control without del produces `verbatim=true`.

## Evidence (do not invent more)

Primary:

- [anthropics/claude-code#90645](https://github.com/anthropics/claude-code/issues/90645) — OPEN, filed 2026-08-29, labels bug/has repro/platform:windows/area:sandbox. Title: PowerShell safety guard: Spanish word "del" inside a quoted commit message is treated as Remove-Item, then blocks on a quote-split path fragment.

Same-class target-side priors (complementary, not identical — those mis-attribute target when a *real* Remove-Item exists; Calque is verb-side hallucination from quoted natural language):

- [anthropics/claude-code#69461](https://github.com/anthropics/claude-code/issues/69461)
- [anthropics/claude-code#73524](https://github.com/anthropics/claude-code/issues/73524)
- [anthropics/claude-code#73882](https://github.com/anthropics/claude-code/issues/73882)

Suggested fix from #90645: tokenize with PowerShell's real parser (`[System.Management.Automation.Language.Parser]::ParseInput` / `PSParser`) so alias detection never matches inside string literals; if the extracted "path" begins with `"` or `'`, do not block.

Cross-check nearby products are DIFFERENT (cite only as “not this”):

- NOT Visa. MCP OAuth missing RFC 8707 resource.
- NOT Fob. Keychain credential proliferation / split-brain.
- NOT Snib / Knock / Veto. Auth/permission classes.
- NOT Quoin. Bash quoted-heredoc unescape.
- NOT Sear / Gaff / Grille / Spile. Bash set -e / timeout-kill / steered edits / hook stdin.
- NOT Fascia / Wicket / Iota. Trust dialog / worktree / path-key.

## Integrations

Slack alarm on calqued / aliased / quote-blind / frag-quote / commit-blocked / path-lie / spanish-del. Linear ticket on calqued / spanish-del / commit-blocked. GitHub calque-ledger of scored probes on every score. Demo mode needs no Slack / GitHub / Linear secrets and no npm. Native stubs fire in the UI (ledger tape / alarm card) without requiring live tokens.
