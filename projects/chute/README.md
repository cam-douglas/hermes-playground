# Chute

Mail chute / dead-drop for sanctioned secret handoff into an agent session. A typed secret is not a handoff. Masked intake or admit **clear**.

Claude Code has no sanctioned channel to hand it a secret — the only surface is the chat prompt, which IS the transcript (three on-disk stores, re-sent every turn, five-year retention via /bug). That single gap maps to 18+ open issues with zero shipped. Chute is the missing inbound primitive: a masked AskUserSecret-style intake whose value never enters the transcript or the model context; it lives in process/session memory only, shows a fingerprint, and lets the agent USE the secret via env inject while never READING it.

Idle word: **clear** (chute empty; no secret in the transcript path).
Same token as Blot's image-tray idle; different desk, different failure.

Verdicts: **clear**, **typed**, **masked**, **burned**, **echoed**, **retained**, **brokered**, **vaulted**, **leaked**, **gap**. Slack alarm on typed / burned / echoed / retained / leaked / gap. Linear ticket on burned / echoed. GitHub chute-ledger issue on every scored probe.

## Why not a clone

NOT Scrim (PostToolUse outbound I/O DLP / redaction after secrets already exist in tool traffic). Chute is the INBOUND channel: prevent the write into the transcript in the first place.

NOT Knock (permission-gate stalls). NOT Quench (token-burn fuse). NOT Hasp (file lease). NOT Parity (claim-vs-reality). NOT Tain (Chrome pairing glass). NOT Husk (hollow headless success). NOT Snib (Trusted Devices fail-open). NOT Veto (heron_brook). NOT Assay (tool-arg). NOT Wicket / Sigil / Stencil / Suture / Blot / Coda / Reed / Fathom / Reveille or any leftover woodworking product.

Different problem, different UI (brass mail chute / pneumatic tube desk — warm brass, tube steel, night lobby; NOT Scrim fabric, NOT Tain mercury glass, NOT Snib brass latch, NOT Husk barn floor, NOT Assay furnace), different backend, different idle word (**clear**).

## Live catalog path

`/chute/` is this static night-lobby mail chute. Warm brass, tube steel, lobby amber. Demo works with no secrets and no npm. Never displays a real secret — only fingerprints, lengths, names, verdicts.

1. Seeded `#90301` **gap** is already on the chute: no AskUserSecret tool; only the prompt box exists → **gap**.
2. Switch **masked** — AskUserSecret panel used; feed shows `● Secret received · GITHUB_TOKEN · 40 chars · fp a3f1c8e2 · session memory` → **masked** / idle toward **clear** after use.
3. Switch `#71654` **burned** — live PAT in transcript/history/paste-cache → **burned**.
4. Switch `#82796` **echoed** — model printed the secret despite never-print rule → **echoed**.
5. Switch **typed** — user pasted into the prompt box → **typed**.
6. Switch **retained** — would reach /bug five-year store → **retained**.
7. Switch **brokered** — USE via env inject, value never in model context → **brokered**.
8. Switch **vaulted** — OS keychain / provider vault path → **vaulted**.
9. Switch **leaked** — `.env` / credential file read straight into transcript → **leaked**.
10. Switch **clear** — chute empty / transcript clean → **clear** (idle).
11. **Drop** uses the sanctioned panel. **Receive** scores. **Inject** brokers (USE never READ). **Admit clear** does not lie. **Clear · clear** empties the chute to the idle word.

## Hook

`projects/chute/hook/` scores a probe `{ channel, askUserSecretAvailable, secretInPrompt, secretInTranscript, modelPrintedSecret, agentCanUse, … }` and returns `{ verdict, reasons[], fingerprint, feed }`. See `hook/README.md`.

```bash
node projects/chute/hook/index.mjs --listen 9030
node --test projects/chute/hook/chute.test.mjs
```

## Evidence (do not invent more)

Primary:

- [anthropics/claude-code#90301](https://github.com/anthropics/claude-code/issues/90301) — map of 18 open secret-channel requests; AskUserSecret primitive

Corroboration inbound:

- [anthropics/claude-code#77084](https://github.com/anthropics/claude-code/issues/77084) — lockbox / broker injection — USE never READ
- [anthropics/claude-code#88165](https://github.com/anthropics/claude-code/issues/88165) — secrets locker a11y
- [anthropics/claude-code#88380](https://github.com/anthropics/claude-code/issues/88380) — mask paste before transcript
- [anthropics/claude-code#38797](https://github.com/anthropics/claude-code/issues/38797) — masked input closed as dup
- [anthropics/claude-code#44158](https://github.com/anthropics/claude-code/issues/44158) — not planned
- [anthropics/claude-code#29910](https://github.com/anthropics/claude-code/issues/29910)
- [anthropics/claude-code#23642](https://github.com/anthropics/claude-code/issues/23642)
- [anthropics/claude-code#73582](https://github.com/anthropics/claude-code/issues/73582)
- [anthropics/claude-code#32733](https://github.com/anthropics/claude-code/issues/32733)
- [anthropics/claude-code#90116](https://github.com/anthropics/claude-code/issues/90116)

Corroboration outbound/burn:

- [anthropics/claude-code#71654](https://github.com/anthropics/claude-code/issues/71654) — live PAT + Forgejo token burned into transcripts
- [anthropics/claude-code#82796](https://github.com/anthropics/claude-code/issues/82796) — model violates never-print
- [anthropics/claude-code#78344](https://github.com/anthropics/claude-code/issues/78344) — classifier blocks every path after user pasted token
- [anthropics/claude-code#44868](https://github.com/anthropics/claude-code/issues/44868) / [#58043](https://github.com/anthropics/claude-code/issues/58043) / [#59094](https://github.com/anthropics/claude-code/issues/59094) — not planned .env→transcript
- [anthropics/claude-code#82351](https://github.com/anthropics/claude-code/issues/82351) / [#87838](https://github.com/anthropics/claude-code/issues/87838) — mcp get prints secrets
- [anthropics/claude-code#90010](https://github.com/anthropics/claude-code/issues/90010)
- [anthropics/claude-code#80153](https://github.com/anthropics/claude-code/issues/80153)
- [anthropics/claude-code#72156](https://github.com/anthropics/claude-code/issues/72156)
