# Ward

A **locksmith's ward / keyway scoring desk** — iron black, brass ward, chalk white, oxblood mismatch, graphite — Fraunces + DM Sans + IBM Plex Mono — for a real Claude Code macOS Keychain defect: **CLAUDE_CONFIG_DIR SET TO THE DEFAULT PATH ($HOME/.CLAUDE) SELECTS A DIFFERENT KEYCHAIN CREDENTIAL ENTRY THAN LEAVING IT UNSET, WITH NO DIAGNOSIS.**

Primary:

- [anthropics/claude-code#92252](https://github.com/anthropics/claude-code/issues/92252) (OPEN, bug, has repro, platform:macos, area:auth, filed ~2026-09-05). Title: `CLAUDE_CONFIG_DIR set to the default path ($HOME/.claude) selects a different Keychain credential entry than leaving it unset, with no diagnosis`. Claude Code 2.1.261. macOS Keychain-only OAuth (no `~/.claude/.credentials.json`). Docs say `CLAUDE_CONFIG_DIR` keys the Keychain entry to that directory. When the directory is byte-identical to the default, only whether the env var is textually present differs — and login is fully lost. `claude auth status` / "Not logged in · Please run /login" never say which credential store was consulted. Automations that unconditionally forward `CLAUDE_CONFIG_DIR` to children reproduce this even when the parent never had the var set.

12:50 ward: a ward that keys the default path as a different Keychain slot than unset is not credential isolation — it is a silent mis-ward. Score the keyway or admit the login already warded.

Idle word: **matched**. Seeded state: **warded** / #92252 — explicit `CLAUDE_CONFIG_DIR=$HOME/.claude` selects a different/empty Keychain entry; `loggedIn` false; no diagnosis. Never idle as lit / blanked / afloat / careened / caught / slipping / locked / wiped / seated / channel / stranded / scratched / live / orphaned / set / scrapped / pure / scorched / cold / voided / banked / rewritten / keyed / strayed / scrubbed / pulled / enacted / withheld / masked / bled / fouled / careted / ringing.

**Ward** is the metal obstruction in a warded lock. Setting the "same" default path explicitly engages a different Keychain ward than leaving the variable unset — the tumblers look identical but the ward is wrong, and nothing diagnoses which slot was tried.

- **matched** = HOLD: unset path and true-default resolve to the same Keychain credential; auth status shows `loggedIn`
- **warded** = #92252: explicit `CLAUDE_CONFIG_DIR=$HOME/.claude` selects a different/empty Keychain entry; `loggedIn` false; no store diagnosis
- **trailing-slash-warded** = `CLAUDE_CONFIG_DIR="$HOME/.claude/"` still `loggedIn` false
- **securestorage-sibling** = `CLAUDE_SECURESTORAGE_CONFIG_DIR="$HOME/.claude"` still `loggedIn` false
- **workaround-empty-pin** = `CLAUDE_CONFIG_DIR="$HOME/.claude" CLAUDE_SECURESTORAGE_CONFIG_DIR=""` restores `loggedIn` true but nulls email / orgId
- **silent-forward** = automation injects the default path into children even when the parent never had the var set
- **no-store-diagnosis** = `claude auth status` never prints which credential store was consulted
- **keychain-only** = no `~/.claude/.credentials.json`; Keychain is the only store

Verdicts: matched, warded, trailing-slash-warded, securestorage-sibling, workaround-empty-pin, silent-forward, no-store-diagnosis, keychain-only.

This is a diagnostic scoring desk. Not an exploit. No payloads. No real credentials. Score whether the keyway matched or the login already warded. Fixtures use fictionalized paths (`$HOME/<demo-home>/.claude`, `keychain:<demo-unset-slot>`, `keychain:<demo-explicit-slot>`).

Hypothesis only (NON-BINDING): Keychain account/service string incorporates the literal presence of `CLAUDE_CONFIG_DIR` (or routes through a `SECURESTORAGE` hash) even when the resolved path equals the default; the diagnosis path never prints the selected store id. Discard if evidence disagrees. Encoded from the issue’s mechanism. Do not claim unseen source.

## Why not a clone

This is specifically: **CLAUDE_CONFIG_DIR SET TO THE DEFAULT PATH SELECTS A DIFFERENT KEYCHAIN CREDENTIAL ENTRY THAN LEAVING IT UNSET, WITH NO DIAGNOSIS.**

NOT Deadlight ([#92249](https://github.com/anthropics/claude-code/issues/92249)) — ListAgents/SendMessage blank in unattended Desktop. Ward is macOS Keychain store selection, not a tool registry shutter.
NOT Careen ([#92246](https://github.com/anthropics/claude-code/issues/92246)) — Windows MSIX mid-session restart. Ward is Keychain ward selection, not a live hull scrape.
NOT Ratchet ([#92242](https://github.com/anthropics/claude-code/issues/92242)) — `/goal` stop-hook BLOCKED re-fire.
NOT Forme ([#92203](https://github.com/anthropics/claude-code/issues/92203)) — TUI scrollback wipe.
NOT Tabula ([#92210](https://github.com/anthropics/claude-code/issues/92210)) — deep-link scratch.
NOT Cupel ([#92122](https://github.com/anthropics/claude-code/issues/92122)) — MCP draft-07 outputSchema validator era.
NOT Heddle ([#91958](https://github.com/anthropics/claude-code/issues/91958)) — MCP session reply mis-bind.
NOT Oubliette ([#92095](https://github.com/anthropics/claude-code/issues/92095)) — cold-parent Dispatch void.
NOT Lye ([#91020](https://github.com/anthropics/claude-code/issues/91020)) — subprocess env scrub of `CLAUDE_CONFIG_DIR`. Ward is the parent’s own explicit-vs-unset Keychain slot, not a child-env wipe.
NOT Coffer ([#91571](https://github.com/anthropics/claude-code/issues/91571)) — Windows OAuth file-store refresh never persisted.
NOT Chatelaine ([#90647](https://github.com/anthropics/claude-code/issues/90647)) — nested mcpOAuth inside the Keychain blob.
NOT Fob ([#90748](https://github.com/anthropics/claude-code/issues/90748)) — Keychain credential litter / new stamp.
NOT Tumbler / Bitting / Escutcheon UIs.

Different surface: macOS Keychain credential-store selection for explicit-vs-unset identical default path vs tool registry / MSIX / hooks / TUI / MCP schemas. Completely different UI (locksmith keyway — iron black, brass ward, chalk white, oxblood mismatch, graphite — not Deadlight night-cabin brass, not Careen tide-teal/copper), backend (probe-shaped JSON of matched / warded / trailing-slash / securestorage-sibling / empty-pin rows), and UX (keyway vs mis-ward simulator, matched/warded state machine, chalk plates).

Cousins are cite-only on a cousin strip; primary stays #92252.

- [#87447](https://github.com/anthropics/claude-code/issues/87447) — OPEN — Repro C same explicit-vs-unset discrepancy. Cite-only.
- [#79223](https://github.com/anthropics/claude-code/issues/79223) — OPEN — `SECURESTORAGE_CONFIG_DIR` docs. Cite-only.
- [#88601](https://github.com/anthropics/claude-code/issues/88601) — OPEN — per-dir isolation intent. Cite-only.
- [#84275](https://github.com/anthropics/claude-code/issues/84275) / [#90527](https://github.com/anthropics/claude-code/issues/90527) — OPEN — hash-suffixed Keychain accumulation. Adjacent, not this. Cite-only.

Backups (document only, do not build): [#92255](https://github.com/anthropics/claude-code/issues/92255) (Ballast), [#92235](https://github.com/anthropics/claude-code/issues/92235) (Doppel), [#92234](https://github.com/anthropics/claude-code/issues/92234) (Barnacle).

Product name stays **Ward**. Do not rename to Deadlight, Careen, Ratchet, Forme, Tabula, Cupel, Heddle, Oubliette, Lye, Coffer, Chatelaine, Fob, Tumbler, Bitting, Escutcheon or any existing catalog slug.

Different UI: locksmith keyway + iron black + brass ward + chalk white + oxblood mismatch / graphite. Fraunces + DM Sans + IBM Plex Mono. NOT Libre Baskerville / Manrope (Deadlight). NOT Newsreader / Figtree (Careen). NOT Outfit / Source Serif 4 / Fragment Mono (Ratchet). NOT Literata / Sora (Forme). NOT Fraunces / Source Sans 3 (Tabula — Fraunces is display here, UI is DM Sans, and the desk is a warded keyhole not a wax tablet). Stay OFF night-cabin brass shutter / careening yard / workshop ratchet / imposing-stone / wax tablet / cupel assay / oubliette pit.

Different verbs: Score the keyway, pin idle matched, pin seeded warded, admit the login already warded, load fixtures, reset to matched. Score the keyway is this desk’s phrase.

Different idle: **matched**.

## Live catalog path

`/ward/` is this static locksmith keyway scoring desk. Path `https://hermes-playground-green.vercel.app/ward/` and subdomain `https://ward.hermes-playground-green.vercel.app` are both fine. Demo works with no secrets and no npm. Mark: `12:50 / hermes catalog #148 / #92252`. `?embed` or `?embed=1` hides chrome for the hub living featured well.

1. Seeded demo loads **warded** — `CLAUDE_CONFIG_DIR` textually set to `$HOME/<demo-home>/.claude`; resolved path equals the default; Keychain slot differs from unset; `loggedIn` false; store id never printed; the login is already warded.
2. Idle **matched** → env unset; resolved path is the true default; same Keychain credential; auth status shows `loggedIn`; the keyway matched.
3. Bench UI: warded keyhole for warded vs open keyway for matched, pin/ward state machine, chalk plates. Matched = same slot. Warded = silent mis-ward.
4. Cousin cite strip labeled cousin-not-primary: [#87447](https://github.com/anthropics/claude-code/issues/87447), [#79223](https://github.com/anthropics/claude-code/issues/79223), [#88601](https://github.com/anthropics/claude-code/issues/88601), [#84275](https://github.com/anthropics/claude-code/issues/84275), [#90527](https://github.com/anthropics/claude-code/issues/90527). Cite only. Primary stays #92252.
5. **Score the keyway** walks the probe ticket and lights chips on the desk. Chip-switch every verdict. Paste or drop JSON. Keyway simulator chips rewrite whether the env is unset, explicit-default, trailing-slash, securestorage-sibling, or empty-pin. Ward machine steps unset → resolve → explicit → slash → sibling → empty-pin.

## How to score

Open `projects/ward/index.html` in a browser, or serve the repo root and visit `/ward/` (Vercel rewrite → `/projects/ward`). No build step. Hook is a documentation stub only:

```bash
# No classifier binary. The living page scores probes in-browser.
# See projects/ward/hook/README.md
```

Empty paste scores the idle **matched** ticket if you pin idle. Paste a probe on the page or drop a fixture from `data/`. The living page seeds **warded**.
