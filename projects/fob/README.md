# Fob

Hotel front-desk key rack / locksmith fob board for a real Claude Code failure class: macOS Keychain credential proliferation and store split-brain. A grant mints a new `Claude Code-credentials-<hash>` item instead of reusing the live one. CLI and desktop compute different hashes from scope-set / client identity. Stale items are never garbage-collected. Keychain-only rotation vs file-only `/login` splits the refresh-token family and forces re-auth.

A new login is not a hold. Score the rack or admit **hung**.

Idle word: **hung** (one live service name, Keychain and `~/.claude/.credentials.json` agree on the same token generation, no stale `Claude Code-credentials-*` litter, CLI and desktop share the key).
NEVER use the product name fob / empty / keychain / login / rack as the idle/state word.
NEVER reuse prior idles: appointed, cinched, gauged, stamped, overrun, pratique, wound, bound, stilled, stabled, drained, flat, fit, spoilt, laid, unlinked, tight, banked, roosted, stocked, seated, heard, clear, paired, kernel, latched, upheld, sterling, home, valid, dry, sealed, quiet, seised.

Verdicts: **hung**, **minted**, **hoard**, **split**, **false-cut**, **scope-key**. Slack alarm on minted / hoard / split / false-cut / scope-key. Linear ticket on minted / hoard / split. GitHub fob-ledger of scored racks on every score.

The #90527 mint (a new hash-suffixed item instead of the live fob) is **minted**, never **hung**, even when `/login` printed success. `Login expired · Please run /login` is a fail, not a hold.

## Why not a clone

NOT Visa (MCP OAuth missing RFC 8707 resource).
NOT Snib (permission night-latch).
NOT Chute (typed secret handoff).
NOT Wraith (live-image unlink).
NOT Iota (Windows path-key identity / case collision).
NOT Ordo (headless plugin slash-command unknown + exit 0).
NOT Cinch (partial folder mounts).
NOT Ullage (silent context drop / prefix-freeze).
NOT leftover woodworking / millimetre-slider products.

Different problem: KEYCHAIN CREDENTIAL LITTER. Did a login reuse the live item, or mint another hash-suffixed fob?
Different UI: hotel key-rack. Dark oak, stamped brass, numbered hooks, hanging ivory tags that multiply. Fonts: Italiana + IBM Plex Mono + Newsreader — not Cormorant/Crimson (Ordo), not Spectral/Nunito Sans (Cinch), not Fraunces/Barlow Condensed (Ullage), not Libre Baskerville/Source Sans 3 (Visa).
Different idle word: **hung**.

## Live catalog path

`/fob/` is this static hotel key-rack. Brass rail, numbered hooks, hanging tags, night register, dump intake. Demo works with no secrets and no npm. Mark: `17:50 Sydney · fob`.

1. Seeded `#90527` **minted** is already on the rack: live item plus new `Claude Code-credentials-1eb0243d` / `525493ee` → **minted**.
2. Switch **hoard** — 75 items, 1,156 historical mcpOAuth copies → **hoard**.
3. Switch **split** — Keychain mdat advanced, file mtime did not, login expired → **split**.
4. Switch **false-cut** — `/login` success, credentials never persisted → **false-cut**.
5. Switch **scope-key** — CLI has `user:mcp_servers`, desktop omits it → **scope-key**.
6. Switch **control** — one live fob, stores agree, CLI and desktop share → **hung**.
7. Switch **Reset · hung** — idle lobby → **hung**. Idle word is **hung** when the rack is reset. One hung fob stays on the board; never an empty or error state.
8. **Score** scores. **Admit hung** scores honestly. **Reset · hung** returns idle hung. **Restore · minted** shows the #90527 mint. Admit does not lie: a minted rack stays minted.

## Hook

`projects/fob/hook/` scores a rack `{ items, liveService, fileMtime, keychainMdat, cliScopes, desktopScopes, minted, loginReportedSuccess, persisted, loginExpired, session, source, issue, scored }` and returns `{ verdict, reasons[], hung }`. Tokens are masked. See `hook/README.md`.

```bash
node projects/fob/hook/index.mjs --listen 9090
node --test projects/fob/hook/fob.test.mjs
```

## Evidence (do not invent more)

Primary:

- [anthropics/claude-code#90527](https://github.com/anthropics/claude-code/issues/90527) — 110 Keychain items in 5 weeks; new hash-suffixed item per login; CLI vs desktop never share; forced re-auth.

Same-class corroborator:

- [anthropics/claude-code#84275](https://github.com/anthropics/claude-code/issues/84275) — 75 daily items, 1,156 duplicated OAuth/MCP tokens, never cleaned.

Shape (cite as shape, not a new primary):

- [anthropics/claude-code#78020](https://github.com/anthropics/claude-code/issues/78020) — Keychain-only rotation vs `.credentials.json`-only `/login`.
- [anthropics/claude-code#89801](https://github.com/anthropics/claude-code/issues/89801) — `/login` success never persists.
- [anthropics/claude-code#79407](https://github.com/anthropics/claude-code/issues/79407) — locked keychain, login reports success, still logged out.
- [anthropics/claude-code#83345](https://github.com/anthropics/claude-code/issues/83345) — corrupted Keychain login loop.
- [openai/codex#33540](https://github.com/openai/codex/issues/33540) — concurrent MCP OAuth refresh keyring coverage.
- [openai/codex#38691](https://github.com/openai/codex/issues/38691) — detached app-server OAuth Keychain access failure.
- [openai/codex#24204](https://github.com/openai/codex/issues/24204) — CLI cannot reach macOS Keychain after update.
