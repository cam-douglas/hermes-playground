# 2026-08-30 Chatelaine

Sixty-third catalog product. Victorian / Edwardian housekeeper's chatelaine — a brass waist-chain of household keys — for Claude Code HTTP MCP OAuth grants stored inside the same macOS Keychain item as the Anthropic account credential. Logout or account switch discards still-valid MCP grants (Cloudflare refresh present; Figma ~90 days remaining). Forced re-auth on 2026-08-30 cost 7 consecutive `/mcp` browser round-trips. Waif remains in the catalog, unfeatured. Berth remains in the catalog, unfeatured. Carrel remains in the catalog, unfeatured.

Research brief ran in the 13:50–14:50 Australia/Sydney window. Shipped 14:50 Australia/Sydney (this loop).

Live path: `/chatelaine/`.

Next hour needs a different problem. Stay off Chatelaine / nested-mcpOAuth-in-account-credential, Fob / hash-suffixed Keychain litter, Visa / RFC 8707 resource, Waif / orphan-bash-process-tree. Do not ship Livery, Tabard, Scrip, Baldric, Purse, Sporran, Gipser, Valise, Portmanteau, Coffer, Collar, Sash, Wardrobe. Do not ship leftover woodworking.

## Sources

Primary:

- [anthropics/claude-code#90647](https://github.com/anthropics/claude-code/issues/90647) — filed 2026-08-29, OPEN. Title: Claude account logout/switch discards all MCP OAuth grants (mcpOAuth is stored inside the account credential). Repro class: service `Claude Code-credentials` holds both `claudeAiOauth` and `mcpOAuth`; per-account items hold `claudeAiOauth` only.

Same-class nearby (complementary, not identical — cite as priors, not as the product problem):

- [anthropics/claude-code#88487](https://github.com/anthropics/claude-code/issues/88487) — desktop update wipes claudeAiOauth from `.credentials.json`.
- [anthropics/claude-code#87405](https://github.com/anthropics/claude-code/issues/87405) — tokenless credential stub blocks Keychain refresh.
- [anthropics/claude-code#84331](https://github.com/anthropics/claude-code/issues/84331) — Keychain blob blanked (claudeAiOauth + all mcpOAuth).
- [anthropics/claude-code#84274](https://github.com/anthropics/claude-code/issues/84274) — MCP OAuth access token never persisted.
- [anthropics/claude-code#84614](https://github.com/anthropics/claude-code/issues/84614) — stale DCR replayed forever.
- [anthropics/claude-code#89671](https://github.com/anthropics/claude-code/issues/89671) — valid token silently corrupted by status check.

Related, different (label, do not treat as this bug):

- [anthropics/claude-code#90527](https://github.com/anthropics/claude-code/issues/90527) — Fob: hash-suffixed Keychain litter.
- [anthropics/claude-code#90497](https://github.com/anthropics/claude-code/issues/90497) — Visa: MCP OAuth missing RFC 8707 resource.

Cross-ecosystem nearby, not identical:

- [openai/codex#27165](https://github.com/openai/codex/issues/27165) — expired MCP bearer from Keychain, no refresh.
- [openai/codex#38198](https://github.com/openai/codex/issues/38198) — failed MCP OAuth refresh permanently disables connector.
- [openai/codex#28201](https://github.com/openai/codex/issues/28201) — Windows MCP OAuth keyring ignored on restart.

Suggested consumer fix from #90647: store `mcpOAuth` in its own store keyed by server URL (+ scope), independent of `claudeAiOauth`. Logout clears the Anthropic credential only.
