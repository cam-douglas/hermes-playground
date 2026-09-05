# Snub

A **dockside snubbing desk / hawser-snub post** — wet timber, hemp rope, verdigris bronze fairlead, sea-mist — Literata + Outfit + JetBrains Mono — for a real Claude Code macOS Bash-tool defect: **A HEREDOC FILE WRITE OF 513–65535 BYTES ON HOMEBREW BASH 5.1+ HANGS FOR THE FULL 120s TIMEOUT AND LEAVES THE TARGET TRUNCATED TO 0 BYTES.**

Primary:

- [anthropics/claude-code#92262](https://github.com/anthropics/claude-code/issues/92262) (OPEN, bug, has repro, platform:macos, area:bash, filed ~2026-09-05). Title: `Bash tool: heredoc file writes deadlock and truncate the target file on macOS with Homebrew bash`. Claude Code 2.1.260 (Claude Desktop, Code tab). macOS 26.5.2 arm64. `/opt/homebrew/bin/bash` GNU bash **5.3.15** (also 5.3.9 in prior reports) **affected**; `/bin/bash` GNU bash **3.2.57** **not** affected. Trigger: macOS with bash 5.1+ first on PATH (default after `brew install bash`). Writing a file whose contents are **513–65535 bytes** via Bash heredoc → hang for full **120s timeout** and target file left **truncated to 0 bytes**.

13:50 snub: a snub that fills the 512-byte pipe before the drain child starts is not a completed write — it is a hawser already snubbed. Score the post or admit the target already emptied.

Idle word: **flowing**. Seeded state: **snubbed** / #92262 — PATH bash is Homebrew 5.1+; Bash-tool heredoc of mid-size body hangs then leaves the file at 0 bytes. Never idle as matched / warded / lit / blanked / afloat / careened / caught / slipping / locked / wiped / seated / channel / stranded / scratched / live / orphaned / set / scrapped / pure / scorched / cold / voided / banked / rewritten / keyed / strayed / scrubbed / pulled / enacted / withheld / masked / bled / fouled / careted / ringing.

**Snub** is the dockside line that stops a vessel dead. Here the Bash-tool heredoc write snubs when the pipe fills before the drain starts — and the redirect already emptied the target.

- **flowing** = HOLD: system `/bin/bash` would have completed, or Write tool used, or body ≤512, or body ≥64 KB
- **snubbed** = #92262: PATH bash is Homebrew 5.1+; Bash-tool heredoc of mid-size body hangs then leaves the file at 0 bytes
- **edge-496-ok** = 496 B OK — under the 512 B cliff
- **edge-600-snub** = ~600 B HANGS — just past the cliff
- **large-100kb-ok** = 100 KB OK — temp-file path
- **homebrew-path** = PATH-resolved bash picks Homebrew instead of `/bin/bash`
- **system-bash-ok** = `/bin/bash` 3.2.57 not affected
- **compat44-mitigation** = `shopt -s compat44` restores pre-5.1 temp-file heredocs (undocumented side effect)

Verdicts: flowing, snubbed, edge-496-ok, edge-600-snub, large-100kb-ok, homebrew-path, system-bash-ok, compat44-mitigation.

This is a diagnostic scoring desk. Not an exploit. No payloads. No real credentials. Score whether the hawser is flowing or already snubbed. Fixtures use fictionalized paths (`/tmp/probe.txt`, `$HOME/<demo-home>/mix.exs`). Diagnostic shapes only (sizes, which bash, hang vs OK, truncated:true).

Hypothesis only (NON-BINDING): the interactive desk should make the 512-byte pipe cliff and truncate-before-body failure visceral. Discard if evidence disagrees. Encoded from the issue’s facts. Do not claim unseen source.

## Why not a clone

This is specifically: **BASH-TOOL HEREDOC FILE WRITES DEADLOCK AND TRUNCATE THE TARGET ON MACOS WITH HOMEBREW BASH.**

NOT Ward ([#92252](https://github.com/anthropics/claude-code/issues/92252)) — Keychain default-path mis-ward. Snub is a pipe-capacity deadlock, not a credential slot.
NOT Deadlight ([#92249](https://github.com/anthropics/claude-code/issues/92249)) — ListAgents/SendMessage blank in unattended Desktop.
NOT Careen ([#92246](https://github.com/anthropics/claude-code/issues/92246)) — Windows MSIX mid-session restart.
NOT Ratchet ([#92242](https://github.com/anthropics/claude-code/issues/92242)) — `/goal` stop-hook BLOCKED re-fire.
NOT Forme ([#92203](https://github.com/anthropics/claude-code/issues/92203)) — TUI scrollback wipe.
NOT Tabula ([#92210](https://github.com/anthropics/claude-code/issues/92210)) — deep-link scratch.
NOT Oxbow / Relict / Hellbox / Cupel / Oubliette / Ephemera / Commutator / Heddle / Hectograph / Placet / Frisket / Tangent / Hawser / Caret / Buoy / Solecism / Coffer / Codicil UIs.

Different surface: Bash-tool heredoc pipe snub on macOS Homebrew bash vs Keychain / tool registry / MSIX / hooks / TUI. Completely different UI (dockside snubbing desk — wet timber, hemp rope, verdigris bronze fairlead, sea-mist — not Ward locksmith iron/brass, not Deadlight night-cabin, not Careen careening yard), backend (probe-shaped JSON of flowing / snubbed / 496-ok / 600-snub / 100kb / PATH / system / compat44 rows), and UX (pipe-cliff gauges + emptied-hold hatch).

Cousins are cite-only on a cousin strip; primary stays #92262.

- [#33768](https://github.com/anthropics/claude-code/issues/33768) — closed, mis-deduped. Cite-only.
- [#44564](https://github.com/anthropics/claude-code/issues/44564) — closed COMPLETED but still present. Cite-only.
- [#62813](https://github.com/anthropics/claude-code/issues/62813) — closed NOT_PLANNED. Cite-only.
- [#92178](https://github.com/anthropics/claude-code/issues/92178) / [#88041](https://github.com/anthropics/claude-code/issues/88041) — auto-mode heredoc guidance. Cite-only.

Backups (document only, do not build): [#92257](https://github.com/anthropics/claude-code/issues/92257) (Verge), [#92259](https://github.com/anthropics/claude-code/issues/92259) (Nested), [#92228](https://github.com/anthropics/claude-code/issues/92228) (Ballast-mem).

Product name stays **Snub**. Do not rename to Ward, Deadlight, Careen, Ratchet, Forme, Tabula, Oxbow, Relict, Hellbox, Cupel, Oubliette, Ephemera, Commutator, Heddle, Hectograph, Placet, Frisket, Tangent, Hawser, Caret, Buoy, Solecism, Coffer, Codicil or any existing catalog slug.

Different UI: wet timber + hemp rope + verdigris bronze fairlead + sea-mist. Literata + Outfit + JetBrains Mono. NOT Fraunces / DM Sans / IBM Plex Mono (Ward). NOT Libre Baskerville / Manrope (Deadlight). NOT Newsreader / Figtree (Careen). Stay OFF locksmith iron/brass / night-cabin shutter / careening yard / hawser UI.

Different verbs: Score the post, pin idle flowing, pin seeded snubbed, admit the target already emptied, load fixtures, reset to flowing. Score the post is this desk’s phrase.

Different idle: **flowing**.

## Live catalog path

`/snub/` is this static dockside snubbing desk. Path `https://hermes-playground-green.vercel.app/snub/` and subdomain `https://snub.hermes-playground-green.vercel.app` are both fine. Demo works with no secrets and no npm. Mark: `13:50 / hermes catalog #149 / #92262`. `?embed` or `?embed=1` hides chrome for the hub living featured well.

1. Seeded demo loads **snubbed** — PATH bash is Homebrew 5.3.15; ~2 KB Bash-tool heredoc hangs 120s; target left 0 bytes; COMPLETED never printed; the hawser is already snubbed.
2. Idle **flowing** → `/bin/bash` 3.2.57 completed; target intact; idle word flowing.
3. Desk UI: verdigris fairlead + hemp hawser, zoom 0–1024 pipe with the 512-byte cliff in the middle, full 0–64 KB pipe where 512 is a sliver, emptied-hold hatch. Flowing = hold intact. Snubbed = truncate-before-body.
4. Cousin cite strip labeled cousin-not-primary: [#33768](https://github.com/anthropics/claude-code/issues/33768), [#44564](https://github.com/anthropics/claude-code/issues/44564), [#62813](https://github.com/anthropics/claude-code/issues/62813), [#92178](https://github.com/anthropics/claude-code/issues/92178), [#88041](https://github.com/anthropics/claude-code/issues/88041). Cite only. Primary stays #92262.
5. **Score the post** walks the probe ticket and lights chips on the desk. Chip-switch every verdict. Paste or drop JSON. Snub simulator chips rewrite PATH bash vs `/bin/bash` vs Write vs compat44, and body size 377 / 496 / ~600 / 2 KB / 100 KB.

## How to score

Open `projects/snub/index.html` in a browser, or serve the repo root and visit `/snub/` (Vercel rewrite → `/projects/snub`). No build step. Hook is a documentation stub only:

```bash
# No classifier binary. The living page scores probes in-browser.
# See projects/snub/hook/README.md
```

Empty paste scores the idle **flowing** ticket if you pin idle. Paste a probe on the page or drop a fixture from `data/`. The living page seeds **snubbed**.
