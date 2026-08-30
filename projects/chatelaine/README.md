# Chatelaine

Victorian / Edwardian housekeeper's **chatelaine** — a brass chain worn at the waist that holds the household keys — for a real Claude Code defect: **HTTP MCP OAuth grants (`mcpOAuth`) are stored inside the same macOS Keychain item as the Anthropic account credential (`claudeAiOauth`).** Logging out or switching Claude accounts therefore discards every HTTP MCP grant, even when those grants have nothing to do with which Anthropic account is signed in and even when their refresh tokens are still valid.

Primary: [anthropics/claude-code#90647](https://github.com/anthropics/claude-code/issues/90647) (OPEN, filed 2026-08-29, has repro). Title: Claude account logout/switch discards all MCP OAuth grants (mcpOAuth is stored inside the account credential).

A nested ring is not a hold. Score the chain or admit **girt**.

Idle word: **girt** (the chatelaine is girt at the waist; MCP grants live on their own ring, independent of the Anthropic identity).
NEVER use girt for a failure. NEVER use the product name chatelaine / empty / silent / mute / idle / sheltered / alongside / seated / credited / level / verbatim / fronted / locked / yanked / caught / stowed / posted / bunged / belayed / rove / keyed / housed / beamed / snug / hung / appointed / cinched / gauged / stamped / overrun / pratique / wound / bound / stilled / stabled / drained / flat / fit / spoilt / laid / unlinked / tight / banked / roosted / stocked / heard / clear / paired / kernel / latched / upheld / sterling / home / valid / dry / quiet / seised / rung / moored / claimed / worn / nested / cut / switched / spilled as the idle/state word.

Verdicts: **girt**, **nested**, **cut**, **switched**, **spilled**, **unexpired**, **rebound**, **tokenless**, **blanked**, **wiped**. Slack chip + Linear ticket on cut / spilled / switched / nested / rebound / unexpired / tokenless / blanked / wiped. GitHub chatelaine-ledger of scored intakes on every score.

The #90647 cut chain (nested store + identity event + still-valid grants discarded) is **cut**, never **girt**. Unique nearby flags win their own seeds because those seeds do not carry the #90647 triad. Fob-shaped hash-suffixed litter without nesting/logout burn is labeled, not this desk.

## Why not a clone

NOT **Fob** — hotel key-rack for *litter*: login mints another `Claude Code-credentials-<8hex>` instead of updating the live item ([#90527](https://github.com/anthropics/claude-code/issues/90527) / [#84275](https://github.com/anthropics/claude-code/issues/84275)). Fob = leftover keys multiplying on the rack. Chatelaine = the keys nested *inside* the wearer's identity, so they leave/die when the wearer logs out. Opposite direction.
NOT **Visa** — MCP OAuth missing RFC 8707 resource indicator ([#90497](https://github.com/anthropics/claude-code/issues/90497)).
NOT **Chute** — sanctioned secret handoff / AskUserSecret.
NOT **Snib** — Trusted Devices fail-open.
NOT **Reed** — MCP registry connected-vs-registered.
NOT **Sprag** — boot-cached MCP failure.
NOT leftover woodworking / millimetre-slider clones.
Do NOT ship alternate names Livery, Tabard, Scrip, Baldric, Purse, Sporran, Gipser, Valise, Portmanteau, Coffer, Collar, Sash, Wardrobe. Product name is **Chatelaine** only.

Different problem: identity logout burns still-valid MCP grants because storage is nested.
Different UI: housekeeper's chatelaine / waist-chain / brass keys / jet beads / linen apron / oxidized brass plate. Cormorant Garamond + IBM Plex Mono + Great Vibes.
Different idle word: **girt**.

## Live catalog path

`/chatelaine/` is this static housekeeper's stillroom desk. Demo works with no secrets and no npm. Mark: `14:50 Sydney · chatelaine`.

1. Seeded `#90647` **cut** is already on the chain: `Claude Code-credentials` holds both `claudeAiOauth` and `mcpOAuth` (Cloudflare ×6 + Figma); logout discarded still-valid grants; `/mcp` ×7 → **cut**. Never girt.
2. Switch **nested** — the #90647 layout before logout fires.
3. Switch **switched** — per-account `Claude Code-credentials-<8hex>` items have no mcpOAuth.
4. Switch **spilled** — every configured HTTP MCP server comes back unauthenticated.
5. Switch **unexpired** — Figma ~90d remaining, Cloudflare refresh present at forced re-auth.
6. Switch **rebound** — seven consecutive `/mcp` browser auths in one session.
7. Switch **tokenless** — nearby #87405 tokenless credential stub.
8. Switch **blanked** — nearby #84331 Keychain blob blanked.
9. Switch **wiped** — nearby #88487 desktop update wipes `.credentials.json`.
10. Switch **Fob litter** — hash-suffixed extra items without nesting/logout burn. Labeled, not cut.
11. Switch **honest girt** — mcpOAuth in its own store; logout leaves MCP grants → **girt** true.
12. **Score** scores. **Admit girt** scores honestly. **Restore · #90647** shows the cut chain. Admit does not lie.

## Hook

`projects/chatelaine/hook/` scores a probe `{ mcpNestedInAccountItem, accountLogoutFired, accountSwitched, perAccountItemsLackMcpOAuth, httpMcpServerCount, unauthenticatedAfterEvent, grantsUnexpired, refreshTokensPresent, consecutiveMcpAuths, tokenlessStub, blankedBlob, desktopWipe, separateMcpStore }` and returns `{ verdict, reasons[], girt }`. See `hook/README.md`.

```bash
node projects/chatelaine/hook/index.mjs --listen 9090
node --test projects/chatelaine/hook/chatelaine.test.mjs
```

`girt` is true ONLY when the verdict is girt (idle, or honest control: mcpOAuth in its own store, logout leaves MCP grants, grants remain usable). Seeded 90647 numbers must produce cut / `girt=false`. Honest control with a separate store produces `girt=true`. A nested ring is never girt.

## Evidence (do not invent more)

Primary:

- [anthropics/claude-code#90647](https://github.com/anthropics/claude-code/issues/90647) — OPEN, filed 2026-08-29. Title: Claude account logout/switch discards all MCP OAuth grants (mcpOAuth is stored inside the account credential). Repro: service `Claude Code-credentials` holds BOTH `claudeAiOauth` AND `mcpOAuth`; per-account `Claude Code-credentials-<8hex>` items hold `claudeAiOauth` only. Forced re-auth on 2026-08-30 cost 7 consecutive `/mcp` browser round-trips. Cloudflare access TTL ~1h with refresh present; Figma access ~2160h (~90 days) remaining with refresh present. None had expired.

Same-class nearby (treat as nearby, scoreable, not the primary):

- [anthropics/claude-code#88487](https://github.com/anthropics/claude-code/issues/88487) — desktop update wipes claudeAiOauth from `.credentials.json`.
- [anthropics/claude-code#87405](https://github.com/anthropics/claude-code/issues/87405) — tokenless credential stub blocks Keychain refresh.
- [anthropics/claude-code#84331](https://github.com/anthropics/claude-code/issues/84331) — Keychain blob blanked (claudeAiOauth + all mcpOAuth).
- [anthropics/claude-code#84274](https://github.com/anthropics/claude-code/issues/84274) — MCP OAuth access token never persisted; reverts unauthenticated after restart.
- [anthropics/claude-code#84614](https://github.com/anthropics/claude-code/issues/84614) — stale DCR replayed forever.
- [anthropics/claude-code#89671](https://github.com/anthropics/claude-code/issues/89671) — valid token silently corrupted by status check.

Related, different (label, do not treat as this bug):

- [anthropics/claude-code#90527](https://github.com/anthropics/claude-code/issues/90527) — Fob: hash-suffixed Keychain litter.
- [anthropics/claude-code#90497](https://github.com/anthropics/claude-code/issues/90497) — Visa: MCP OAuth missing RFC 8707 resource.

Cross-ecosystem nearby, not identical:

- [openai/codex#27165](https://github.com/openai/codex/issues/27165) — Codex Desktop sends expired MCP bearer from Keychain, does not refresh.
- [openai/codex#38198](https://github.com/openai/codex/issues/38198) — failed MCP OAuth refresh permanently disables connector.
- [openai/codex#28201](https://github.com/openai/codex/issues/28201) — Windows MCP OAuth keyring credentials ignored on restart.

Cross-check nearby products are DIFFERENT (cite only as “not this”):

- NOT Fob #90527, Visa #90497, Chute, Snib, Reed, Sprag, leftover woodworking.

Suggested consumer fix from #90647 (document, do not implement against Claude Code itself): store `mcpOAuth` in its own store keyed by server URL (+ scope), independent of `claudeAiOauth`. Logout clears the Anthropic credential only.
