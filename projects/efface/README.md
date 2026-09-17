# Efface

A **credential-vault / redaction / mask-credential-files booth** — sandbox `credentials.files` mask should leave a **sentinel** `~/.config/gh/hosts.yml` (real `oauth_token` scrubbed to placeholder) while outbound `api.github.com` gets the real token via the sandbox proxy. Instead the credential file is **effaced** entirely (**ENOENT**); `gh auth status` shows not logged in. Fonts **Libre Baskerville** (display) + **Outfit** (UI) + **IBM Plex Mono** (chips). Palette: charcoal `#2a2d32`, bone `#e8e2d6`, rust `#a34b32`, teal `#2a6b6b`, parchment `#f5efe3`. NOT Precis abstract graft. NOT Apocope fetch truncation. NOT Detent ratchet atelier.

The booth should stay **sentinel** (HOLD: masked file housed in sandbox). Instead the booth is **absent** after **mask-void**.

Primary:

- [anthropics/claude-code#95135](https://github.com/anthropics/claude-code/issues/95135) (OPEN). Sandbox `credentials.files` mask produces no file at all for `~/.config/gh/hosts.yml`. Environment: Claude Code 2.1.270 native; Linux remote/EC2 via desktop remote client; gh 2.100.0.

06:50 efface: a credential-vault / redaction / mask-credential-files booth for #95135 (catalog #391). Mask should leave sentinel hosts.yml; actual ENOENT inside sandbox. Idle **sentinel** / seeded **absent** / path **mask-void**. Score efface or admit sentinel.

Score efface or admit sentinel.

Idle word: **sentinel** (HOLD: masked sentinel file present). HOLD aliases: masked, present, housed. Seeded word: **absent**. Path word: **mask-void**. Product score: **efface**. NOT reknit/paraphrase (Precis). NOT flagged/verbatim (Apocope).

Phrase: **Score efface or admit sentinel.**

- **sentinel** = IDLE HOLD: masked hosts.yml visible inside sandbox
- **absent** = seeded path: file missing entirely (ENOENT)
- **mask-void** = path word: credentials mask produces no file
- **masked**, **present**, **housed** = HOLD aliases
- Chip verdicts: credentials-files, hosts-yml, inject-hosts, deny-read, gh-auth, tls-terminate, enoent, landing, has-repro, cousins, backups, fixtures, walk, closed

This is a diagnostic scoring booth. Not an exploit. No Claude sessions. No network from the booth. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING — issue text): remote/EC2 desktop-remote launch path may skip credential-handling (similar gap noted for awsCredentialExport). Invite verify against #95135 text only.

## Research brief

Source: [anthropics/claude-code#95135](https://github.com/anthropics/claude-code/issues/95135)

What happened (from issue text):

- Expected: on Linux/WSL2, sandboxed read of `~/.config/gh/hosts.yml` should see a sentinel copy; outbound `api.github.com` gets real token via sandbox proxy (docs: mask-credential-files).
- Actual: file does not exist inside sandbox at all — not sentinel, not real — ENOENT. `ls ~/.config/gh/` shows only `config.yml`. `gh auth status` → not logged in; git HTTPS fails asking for Username. Outside sandbox the same commands work.
- Config: `credentials.files` path `~/.config/gh/hosts.yml`, mode mask, extract `oauth_token`, injectHosts `api.github.com`, maskDuplicates true, onExtractNoMatch error; broad denyRead `~/` with allowRead including `~/.config/gh/config.yml`.
- Verification in issue: extract regex matches outside sandbox; file ASCII 216 bytes; tlsTerminate active; fresh session; /sandbox Config tab shows FS rules but no credentials mask status section.
- Workaround: escalate gh/git over unsandboxed path.

## Why not a clone

NOT Apocope/#95127 (WebFetch truncation / unmarked). NOT Precis/#94564 (skill-drop). NOT Cenotaph/#94452 (dead-install). NOT Detent/#94565 (mouse-dead). This is **mask-void credential effacement**: idle sentinel / seeded absent / path mask-void. Do NOT rebuild Apocope or Precis paradigms here.

Backups (cite only): #94553, #94560, #93924, #93770, #93777, #94151 — do not auto-pick.

## Run

```bash
node --test projects/efface/efface.test.mjs
node projects/efface/efface.mjs projects/efface/data/absent.json
```

Live: https://hermes-playground-green.vercel.app/efface/
