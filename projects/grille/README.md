# Grille

Bank teller's bronze grille / night-depository desk for a real Claude Code failure: **bypass-permissions (and other permission modes) inject a system-prompt directive that steers file mutations through Bash `sed`/heredocs/short scripts instead of Edit/Write**. Edit/Write tool cards render diffs; Bash does not. So all edit diffs silently vanish. PreToolUse hooks matching `Write|Edit|NotebookEdit` never fire (a hook that does not fire looks like a hook with nothing to object to). `diffTool` and PostToolUse keyed on Edit/Write go blind. `permissions.deny` Edit(path)/Write(path) go blind. Rules with `paths:` frontmatter never lazy-load. Transcript JSONL has no edit contents (rewind/#87575). The only workaround is a CLAUDE.md prompt overriding a prompt — not a setting. Changelog 2.1.240–2.1.251 is silent. acceptEdits restores Edit/Write and the diffs.

Primary: [anthropics/claude-code#90599](https://github.com/anthropics/claude-code/issues/90599) (open, filed 2026-08-29, macOS, Claude Code 2.1.251, also 2.1.248 and 2.1.250). `skipDangerousModePermissionPrompt` true. System prompt: "Do your work through the Bash tool … make file changes with sed, heredocs, or short scripts, rather than using the dedicated Read, Edit, or Write tools." Diffs vanish. acceptEdits restores them. No changelog entry 2.1.240–2.1.251. No setting. CLAUDE.md override is prompt-vs-prompt.

A night drop through the slot is not a hold. Score the grille or admit **posted**.

Idle word: **posted** (transaction went through the teller grille; Edit/Write used; a receipt/diff would render; hooks that match Write|Edit would have been consulted).
NEVER use the product name grille / grill / empty / silent / mute / idle / dead as the idle/state word.
NEVER reuse prior idles: bunged, belayed, rove, keyed, housed, beamed, snug, hung, appointed, cinched, gauged, stamped, overrun, pratique, wound, bound, stilled, stabled, drained, flat, fit, spoilt, laid, unlinked, tight, banked, roosted, stocked, seated, heard, clear, paired, kernel, latched, upheld, sterling, home, valid, dry, sealed, quiet, seised, rung, moored.

Verdicts: **posted**, **slotted**, **steered**, **unreceipted**, **unhooked**, **killed**, **overlay**, **ungated**, **allowlisted**, **restored**. Slack alarm on slotted / steered / unreceipted / unhooked / killed / allowlisted. Linear ticket on slotted / steered / unhooked / killed. GitHub grille-ledger of scored probes on every score.

The #90599 steered desk (bypass directive present, Bash write-capable, Edit/Write unused, diffs would not render, Write|Edit hooks would not fire) is **steered**, never **posted**. Unique nearby flags win their own seeds because those seeds do not carry the steered pentad.

## Why not a clone

NOT **Stencil** — plan-mode fence (Write/Bash succeed mid-plan when they should not). Grille is permission-mode *steering* to Bash so the audited Edit path is abandoned.
NOT **Hasp** — file-path lease / last-writer-wins races.
NOT **Coda** — silently dropped assistant text.
NOT **Veto** — heron_brook system-prompt injection that vetoes Agent-tool delegation. Grille is a *tool-path* injection (use Bash not Edit), not an Agent-tool veto.
NOT **Tappet** — silent hook *injection* of additionalContext. Grille is hooks *never consulted* because the write never used Edit/Write.
NOT **Assay** — tool-arg wire-format / schema vs markup.
NOT **Spile** — hook stdin kept open without EOF + unenforced timeout.
NOT **Scant** — Bash snapshot PATH truncation at ~7.2KB on Windows.
NOT **Knock** — permission-grant stalls.
NOT **Gasket** — project sandbox.network.strictAllowlist discarded.
NOT **Iota** — typesetter's type-case for path-key casing. Do not use a print shop / type-case / galley / composing-stick UI. Iota already owns typesetting.
NOT **Blot** — image-poison darkroom.
NOT **Wicket** — worktree isolation gatehouse.
Do NOT ship alternate names Galley, Chase, Stick, Proof, Slug, Kerf, Crop, Stump, Snip, Quill, Nib, Trunc, Ferrule, Darkroom, Shutter, Till, Cage, Slot, Nightbox, Palimpsest. Product name is **Grille** only.

Different problem: PERMISSION-MODE SYSTEM PROMPT STEERS FILE MUTATIONS TO BASH → DIFFS VANISH + WRITE HOOKS/DENY RULES GO BLIND.
Different UI: bank **teller's bronze grille** — marble counter, bronze lattice window, receipt stamp, cash drawer, night-depository slot on the side, bypass-mode lamp. Cool bank-green / bronze / cream / black ink. NOT a print shop, NOT a cellar bung, NOT a wet pier, NOT a sail loft, NOT a steam flange, NOT a gatehouse, NOT a valve train, NOT a hotel key-rack, NOT a type-case.
Different idle word: **posted**.

## Live catalog path

`/grille/` is this static teller-grille desk. Marble counter, bronze lattice, receipt stamp, cash drawer, night-depository slot, bypass lamp. Demo works with no secrets and no npm. Mark: `01:50 Sydney · grille`.

1. Seeded `#90599` **steered** is already on the desk: injected “While bypass permissions mode is active” (also auto) told the model to prefer Bash for file changes; diffs vanish; Write|Edit hooks would not fire → **steered**. Never posted.
2. Switch **slotted** — mutation went through the night-depository slot: Bash sed / heredoc / python -c write / redirect. No Edit/Write card.
3. Switch **unreceipted** — diffs vanished; user has no visual record of what changed in which file.
4. Switch **unhooked** — PreToolUse Write|Edit|NotebookEdit never invoked; path-deny and `paths:` frontmatter go blind.
5. Switch **killed** — Windows: platform-ungated heredoc/here-string write truncated or failed; 2–3× tokens vs Write.
6. Switch **overlay** — only CLAUDE.md prompt-vs-prompt workaround; no `preferBashForFileOps` / `showEditDiffs` setting.
7. Switch **ungated** — file-write directive prescribes POSIX heredocs with no platform condition while Platform: win32 is already in context.
8. Switch **allowlisted** — innocent Bash(python3 *) / Bash(sed *) allowlist grants unbounded workspace writes with zero prompts.
9. Switch **restored** — acceptEdits (or leaving bypass) restores Edit/Write and diffs.
10. Switch **control posted** / **Reset · posted** — Edit/Write used, diff would render, hooks would fire → **posted** true.
11. **Score** scores. **Admit posted** scores honestly. **Restore · #90599** shows the steered desk. Admit does not lie: a steered/slotted probe stays that class.

## Hook

`projects/grille/hook/` scores a probe `{ session, issue, source, permissionMode, bypassDirectivePresent, toolUsed, bashWriteCapable, editWriteUsed, diffWouldRender, preToolUseEditWriteWouldFire, windowsPlatform, heredocPrescribed, writeFailedOrTruncated, allowlistBashWrite, claudeMdOverrideOnly, noSettingToggle, acceptEditsRestored, scored }` and returns `{ verdict, reasons[], posted }`. See `hook/README.md`.

```bash
node projects/grille/hook/index.mjs --listen 9090
node --test projects/grille/hook/grille.test.mjs
```

`posted` is true ONLY when Edit/Write was used, a diff would render, Write|Edit hooks would fire, and the verdict is not a failure class. Seeded 90599 numbers must produce steered / `posted=false`. Control Edit/Write path produces `posted=true`. Restored classifies **restored** with `posted=false` (recovery, not idle control).

## Evidence (do not invent more)

Primary:

- [anthropics/claude-code#90599](https://github.com/anthropics/claude-code/issues/90599) — open, filed 2026-08-29, macOS, Claude Code 2.1.251 (also 2.1.248, 2.1.250). skipDangerousModePermissionPrompt true. System prompt: "Do your work through the Bash tool … make file changes with sed, heredocs, or short scripts, rather than using the dedicated Read, Edit, or Write tools." Diffs vanish. acceptEdits restores them. No changelog entry 2.1.240–2.1.251. No setting. CLAUDE.md override is prompt-vs-prompt.

Same-class:

- [anthropics/claude-code#90597](https://github.com/anthropics/claude-code/issues/90597) — Windows: same file-write directive prescribes heredocs without platform gate; PowerShell has no heredoc; Git Bash marshalling can truncate; 2–3× tokens vs Write.
- [anthropics/claude-code#89251](https://github.com/anthropics/claude-code/issues/89251) — has repro, area:security. Same directive in bypass AND auto mode. PreToolUse Write|Edit|NotebookEdit never called. Closed predecessor [#63786](https://github.com/anthropics/claude-code/issues/63786). Comment by nzaytsev: deny rules, paths: frontmatter, rewind/transcript diffs ([#87575](https://github.com/anthropics/claude-code/issues/87575)) all go blind. Referenced by [#89716](https://github.com/anthropics/claude-code/issues/89716).
- [anthropics/claude-code#85511](https://github.com/anthropics/claude-code/issues/85511) — manual permission mode: Bash python/sed bypass per-edit diff review; Bash(python3 *) allowlist → zero prompts.
- [anthropics/claude-code#29709](https://github.com/anthropics/claude-code/issues/29709) — PreToolUse:Edit circumvented via Bash python write after Edit was blocked 3 times.
- [anthropics/claude-code#31292](https://github.com/anthropics/claude-code/issues/31292) — disallowedTools: [Write, Edit] trivially bypassed via sed/awk/redirects.

Cross-check nearby bugs are DIFFERENT (cite only as “not this”):

- NOT Stencil. Plan-mode fence (Write/Bash succeed mid-plan).
- NOT Hasp. File-path lease / last-writer-wins.
- NOT Coda. Silently dropped assistant text.
- NOT Veto. heron_brook Agent-tool veto. Grille is a tool-path injection.
- NOT Tappet. Silent hook injection. Grille is hooks never consulted.
- NOT Assay. Tool-arg wire-format / schema vs markup.
- NOT Spile. Hook stdin kept open without EOF + unenforced timeout.
- NOT Scant. Bash snapshot PATH truncation on Windows.
- NOT Knock. Permission-grant stalls.
- NOT Gasket. Project sandbox.network.strictAllowlist discarded.
- NOT Iota. Typesetter's type-case for path-key casing.
- NOT Blot. Image-poison darkroom.
- NOT Wicket. Worktree isolation gatehouse.

Cross-ecosystem:

- [openai/codex#10330](https://github.com/openai/codex/issues/10330) — model claims apply_patch unavailable, uses bash/python; after wire_api fix still uses cat on Windows to create files
- [openai/codex#16397](https://github.com/openai/codex/issues/16397) — custom provider cannot apply_patch, resorts to sed / cat heredoc
- [openai/codex#17899](https://github.com/openai/codex/issues/17899) — apply_patch missing, falls back to sed/echo

## Integrations

Slack alarm on slotted / steered / unreceipted / unhooked / killed / allowlisted. Linear ticket on slotted / steered / unhooked / killed. GitHub grille-ledger of scored probes on every score. Demo mode needs no Slack / GitHub / Linear secrets and no npm. Native stubs fire in the UI (ledger tape / alarm card) without requiring live tokens.
