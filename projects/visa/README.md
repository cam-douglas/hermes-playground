# Visa

Passport-control / visa-stamp desk for Claude Code MCP OAuth that omits the RFC 8707 `resource` parameter. A login without a destination is **not** a hold. Score the border or admit **stamped**.

A visa names the destination. RFC 8707 `resource` is that name: the MCP server's canonical resource URI from RFC 9728 Protected Resource Metadata. On 2.1.251 the client does not send `resource` in `/authorize` or `/token` even though MCP 2025-06-18 Authorization requires it (MUST) in both. The issued access token therefore carries `aud=<client_id>` (the client's default audience) instead of the MCP server's canonical resource URI, and spec-compliant (strict) MCP servers reject it with 401. This is distinct from #52871 where `resource` is sent but corrupted with a trailing slash.

Idle word: **stamped** (visa correctly names the destination resource; border quiet).
NEVER use the product name visa / empty / resource / oauth / audience as the idle/state word.
NEVER reuse prior idles: overrun, pratique, bound, stilled, drained, flat, fit, spoilt, laid, unlinked, tight, banked, roosted, stocked, seated, heard, clear, paired, kernel, latched, upheld, sterling, home, valid, dry, sealed, quiet, seised, stabled, wound.

Verdicts: **stamped**, **omitted**, **audless**, **clientid**, **refused**, **strict**, **slashy**, **mismatched**, **granted**, **held**. Slack visa alarm on omitted / audless / clientid / refused / slashy / mismatched. Linear ticket on omitted / clientid / refused. GitHub visa-ledger of border events on every scored probe.

## Why not a clone

NOT Sprag (boot-cached MCP attach / overrunning clutch — connect-at-boot race).
NOT Reed (four-contact MCP registry: connected vs registered vs one served call).
NOT Husk (hollow headless success envelopes).
NOT the Connected-with-zero-tools / missing Mcp-Session-Id class (#90477) — that is session-id hollow registration, not OAuth audience.
NOT Lazaret, Fusee, Iota, Leat, Shunt, Sump, Pleat, Scant, Chad, Kist, Wraith, Gasket, Damper, Cote, Larder, Tappet, Aside, Chute, Tain, Snib, Veto, Assay, Wicket, Sigil, Stencil, Suture, Blot, Coda, Fathom, Hasp, Parity, Reveille, Quench, Scrim, Knock.
NOT any leftover woodworking / millimetre-slider product.
Do NOT ship Passport, Border, Blotter, Stamp, Resource, Audience, or OAuth as alternate product names this hour. Product name is **Visa** only.

Different problem: OAuth token issued without naming the destination resource, so strict houses 401 even after a "successful" login.
Different UI: passport control / visa desk. Navy leather blotter, brass circular stamp, watermark paper, departure-hall amber lamps, ink-pad crimson, immigration teal stripe, paper cream. Fonts: Libre Baskerville + Source Sans 3 — not Teko/Atkinson (Sprag), not Bodoni (Fusee).
Different idle word: **stamped**.

## Live catalog path

`/visa/` is this static passport-control page. Navy blotter, brass stamp, watermark landing card, amber lamps, teal stripe, crimson ink pad. Demo works with no secrets and no npm. Mark: `13:50 Sydney · visa`.

1. Seeded `#90497` **omitted** is already on the blotter: resource absent from `/authorize` and `/token`; token `aud=mcp-client`; strict house 401 → **omitted**.
2. Switch **audless** — token has no useful audience claim → **audless**.
3. Switch **clientid** — aud equals OAuth client_id (default audience) → **clientid**.
4. Switch **refused** — strict MCP server returns 401 on the token → **refused**.
5. Switch **strict** — server enforces RFC 8707 / MCP auth (the house that rejects) → **strict**.
6. Switch **slashy** — resource was sent but trailing-slash corrupted (#52871 shape) → **slashy**.
7. Switch **mismatched** — aud / resource URI does not match Protected Resource Metadata → **mismatched**.
8. Switch **granted** — soft/legacy server accepted a wrong-audience token (false green) → **granted**.
9. Switch **held** — probe incomplete / waiting on OAuth dance → **held**.
10. Switch **Bail · stamped** — login not a hold, nothing scored → **stamped**. Idle word is **stamped** when the probe is idle.
11. **Score** scores. **Admit stamped** scores honestly. **Bail** returns idle stamped. **Clear / restore seed** shows the #90497 omitted strike. Admit does not lie: an omitted probe stays omitted.

## Hook

`projects/visa/hook/` scores a probe `{ resourceSentAuthorize, resourceSentToken, resourceValue, audClaim, clientId, canonicalResourceUri, serverStrict, httpStatus, trailingSlashCorruption, oauthCompleted, session, source, issue, scored }` and returns `{ verdict, reasons[], cluster[], stamped, omitted, clientid }`. See `hook/README.md`.

```bash
node projects/visa/hook/index.mjs --listen 9090
node --test projects/visa/hook/visa.test.mjs
```

## Evidence (do not invent more)

Primary:

- [anthropics/claude-code#90497](https://github.com/anthropics/claude-code/issues/90497) — filed 2026-08-29, open. Title: "MCP OAuth client does not send RFC 8707 `resource` (2.1.251) — strict MCP servers reject the token (401)". Claude Code 2.1.251. HTTP MCP whose RFC 9728 metadata declares `resource: http://localhost:8130/mcp`, Keycloak 26.7.2 with `resource-indicators`. `/mcp` completes browser login + consent. Issued token: `aud=mcp-client` (client_id default), no `resource` claim. Server 401 `claim check failed: aud actual="mcp-client"`. AS-side control tests isolate the cause: `resource` was absent from **both** `/authorize` and `/token`. Distinct from #52871 (sent but trailing-slash corrupted).

Shape (cite as shape, not a new primary):

- [anthropics/claude-code#52871](https://github.com/anthropics/claude-code/issues/52871) — open. 2.1.119 sends `resource` but appends a trailing slash to host-only URLs. Entra AADSTS9010010.
- [anthropics/claude-code#73460](https://github.com/anthropics/claude-code/issues/73460) — closed not_planned. Feature: override or omit `resource` for Entra App ID URI vs server URL.
- [anthropics/claude-code#76096](https://github.com/anthropics/claude-code/issues/76096) — closed duplicate. Entra `resource` must be App ID URI; RFC 9728 check wants the server URL.
- [anthropics/claude-code#55495](https://github.com/anthropics/claude-code/issues/55495) — closed not_planned. HTTP transport strips path; OAuth resource indicator becomes origin + trailing slash.

Cross-ecosystem shape (cite as shape, not a new primary):

- [openai/codex#13891](https://github.com/openai/codex/issues/13891) — open. `codex mcp login` omits `resource` from the authorize URL; token audience is the default.
- [openai/codex#33403](https://github.com/openai/codex/issues/33403) — open. Refresh omits `resource`; AS returns `invalid_target` after access-token expiry.
