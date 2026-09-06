# Catachresis

A **lexicographer stamp desk / misnomer atelier** — ink-pad stamps, wrong-word overlay, OAuth challenge strip, scope ledger, JSON-RPC / WWW-Authenticate panels; dark indigo ink on cream folio — Fraunces + Manrope + JetBrains Mono — for a real Claude Code defect: **MCP CLIENT SHOWS "TOKEN EXPIRED" FOR A 403 `insufficient_scope` RESPONSE.** A rubber stamp should name the challenge on the slip. The client instead stamps **EXPIRED** over a live token (**mislabeled**). When the UI names the missing scope from the challenge (**scoped**), that is the hold path.

Primary:

- [anthropics/claude-code#92518](https://github.com/anthropics/claude-code/issues/92518) (OPEN, bug, has repro, area:mcp). Title: `[BUG] MCP client shows "token expired" for a 403 insufficient_scope response`. Filed 2026-09-06T16:32:31Z. Reporter: TadejPolajnar. Claude Code 2.1.258; MCP spec 2026-07-28 OAuth 2.1; TypeScript SDK v2.

03:50 catachresis: a lexicographer stamp desk that should name a missing MCP OAuth scope but instead stamps EXPIRED over a live token's 403 insufficient_scope challenge (#92518). Score mislabeled or admit scoped.

Idle word: **mislabeled** (client calls a live token "expired" when the challenge is `insufficient_scope`). Seeded state: **scoped** / #92518 — UI names the missing scope; step-up / correct challenge handling. Never idle as saturating, vented, preheating, lit, hangfired, executed, thrashing, responsive, leaking, excised, remanent, rewritten, cleared, maxed, mute, inherited, freewheeling, deaf, choking, miscast, unguided, dropped, strobing, stolen, dawnlocked, cold, voided, alongside, shed, latched, quiet, bound, open, sostenutoed, frozen, resolved, or literal.

**Catachresis** is using a word in the wrong sense. The desk keeps a live grant and a 403 challenge that already names `events:write`. The stamp still says EXPIRED.

- **mislabeled** = IDLE: client stamps `token expired` over a 403 `insufficient_scope` challenge
- **scoped** = seeded word: UI names the missing scope; correct challenge handling / step-up
- **no-401** = no 401 was ever returned; only two 403s
- **no-refresh** = zero `POST /oauth/token` with `grant_type=refresh_token`; only `authorization_code` after manual re-auth
- **token-still-valid** = ~55 minutes of a 1-hour lifetime remaining; TTL 3600s; issued ~5 minutes before the failure
- **insufficient-scope-challenge** = `WWW-Authenticate: Bearer error="insufficient_scope", scope="events:write", ...` plus JSON-RPC `Insufficient scope: events:write required`
- **events-write-missing** = grant carried `events:read`; `events_list` / `events_get` → 200; `events_delete` → 403
- **reauth-widened-scopes** = second `/authorize` requested `scope=events:read events:write`; widening, not refreshing, made delete succeed
- **cousins** = cite-only #19066 #28258 #44652 (all locked; still repro on 2.1.258)

Verdicts: mislabeled, scoped, no-401, no-refresh, token-still-valid, insufficient-scope-challenge, events-write-missing, reauth-widened-scopes, cousins.

This is a diagnostic scoring assay. Not an exploit. No live Claude sessions. No real tokens. Score whether the stamp would mislabel a live grant as expired or already name the missing scope. Fixtures use the issue's 403 challenge, JSON-RPC message, tool-call statuses, TTL note, and re-auth scopes only.

Encoded from the issue body only. Do not invent source-code claims.

## Research brief

Sources:

- Primary: [anthropics/claude-code#92518](https://github.com/anthropics/claude-code/issues/92518)
- Cousins cite-only (NOT primary): [anthropics/claude-code#19066](https://github.com/anthropics/claude-code/issues/19066), [anthropics/claude-code#28258](https://github.com/anthropics/claude-code/issues/28258), [anthropics/claude-code#44652](https://github.com/anthropics/claude-code/issues/44652)

What happened (from the issue — do not invent):

- Environment: Claude Code 2.1.258; MCP spec 2026-07-28, OAuth 2.1 AS, TypeScript SDK v2. Server returns the challenge per spec §authorization.
- Symptom: an MCP server returns `403` with `WWW-Authenticate: Bearer error="insufficient_scope"` when a token lacks the scope for a tool. Claude Code shows `MCP server "..." requires re-authorization (token expired)`.
- The token was **not** expired. It had ~55 minutes of its 1-hour lifetime remaining. The real problem was a missing scope on the grant.
- The message sends you to debug the wrong thing. The reporter spent a full session investigating token lifetimes and refresh handling before reading server logs and finding a 403, not a 401.
- Read tools need `events:read`, write tools need `events:write`. The grant only carried `events:read`.
- `POST /api/mcp` `events_list` → 200; `events_get` → 200; `events_delete` → 403.
- The 403 carries `WWW-Authenticate: Bearer error="insufficient_scope", scope="events:write", resource_metadata="https://example.com/.well-known/oauth-protected-resource/api/mcp"` and JSON-RPC `{"jsonrpc":"2.0","id":null,"error":{"code":-32600,"message":"Insufficient scope: events:write required"}}`.
- Server-side logs for the whole session: **no 401 was ever returned** (only two 403s); **no refresh was attempted** (zero `POST /oauth/token` with `grant_type=refresh_token`; the only token call was the `authorization_code` exchange after manual re-auth); **the token was valid** (TTL 3600s, issued ~5 minutes before the failure).
- Re-auth "fixed" it by widening scopes, not by refreshing. The second `/authorize` requested `scope=events:read events:write`; the first had not. The same delete then succeeded.
- Expected: distinguish `error="invalid_token"` (401) → "token expired", re-authorize vs `error="insufficient_scope"` (403) → say the scope is missing, and name it. Ideally perform step-up authorization using the `scope` from the challenge. At minimum, don't call it an expiry.

Problem found: MCP 403 `insufficient_scope` + named `events:write` → Claude Code stamps **token expired** on a live grant → no 401, no refresh → re-auth only helps by widening scopes.

Why this solution: a diagnostic scorer for the mislabeled stamp → scoped headword chain, so a reader can admit idle mislabeled, pin seeded scoped, and score no-401 / no-refresh / token-still-valid / insufficient-scope-challenge / events-write-missing / reauth-widened-scopes / cousins against the published facts.

## Why not a clone

This is specifically: **MCP OAuth challenge mislabel — 403 `insufficient_scope` shown as token expired.**

NOT Bourdon/#92510 — Cowork/Code Apple Virtualization VM host fd climb toward `kern.maxfiles`. Catachresis is an MCP OAuth challenge-mapping misnomer, not a pressure-gauge fd leak.
NOT Solecism/#91558 — worktree provisioning writes a literal `--git-common-dir/` path. Different bug: grammar-desk path literal, not OAuth scope mislabel.
NOT Glowplug/#85050 — Windows silent startup preheat gaps.
NOT Hangfire/#92478 — queued `/compact` demoted to a plain prompt.
NOT Thrash/#88257 — first-prompt event-loop stall / RSS balloon.
NOT Muzzle/#92459 — safe-mode skill_listing attachment leak.
NOT Latchkey/#92330 — Remote Control auto-start demands `/login` while refresh is still renewable. Latchkey is a dawn latch / false re-login on a renewable refresh; Catachresis is an MCP 403 scope challenge stamped EXPIRED.
NOT Coffer/#91571 — Windows OAuth file-store refresh rotation never persisted.
NOT Lethe — session tokens washed downstream after sign-out.
NOT Hysteresis / Hardstand / Rheostat / Aphonia / Fulcrum / Wildcat / Clobber / Watchdog / Understudy / Fairlead / Stroboscope / Heliostat / Frizzen or any prior catalog slug.

Do NOT name this after prior paradigm desks.
Do NOT reuse idle saturating / vented / preheating / hangfired / thrashing / leaking / remanent / rewritten / cleared / maxed / mute / inherited / freewheeling / deaf / choking / miscast / unguided / dropped / strobing / stolen / dawnlocked / cold / voided / alongside / shed / latched / quiet / bound / open / sostenutoed / frozen / resolved / literal.
Do NOT reuse seeded lit / executed / responsive / excised / rewritten / refused / hardwired / vented.

Different surface: MCP 403 `WWW-Authenticate` scope challenge mapped to "token expired" vs Bourdon host-fd climb / Solecism git-flag literal / Latchkey renewable-refresh false login / Coffer refresh-store void.

Product name stays **Catachresis**. Name/slug `catachresis` confirmed unused in catalog.json (186 products).

Different UI: lexicographer stamp desk / misnomer atelier / ink-pad stamps / wrong-word overlay / OAuth challenge strip / scope ledger / JSON-RPC + WWW-Authenticate panels. Dark indigo ink on cream. Fraunces / Manrope / JetBrains Mono. NOT brass Bourdon-tube gauge (Bourdon — Archivo Black + Sora + IBM Plex Mono). NOT manuscript grammar desk (Solecism — Source Serif 4 + Work Sans + Inconsolata). NOT diesel glow-plug bay (Glowplug — Teko + Outfit + Share Tech Mono). Stay OFF brass pressure gauge / grammar-margin folio / diesel preheat / cartridge primer / CRT paging-storm / olive range.

Different verbs: admit mislabeled, pin seeded scoped, score mislabeled vs scoped, load #92518 fixture, score probes.

Different idle: **mislabeled**. Different seeded: **scoped**. HOLD: **scoped**. ALARM: **mislabeled** / **no-401** / **no-refresh** / **token-still-valid** / **insufficient-scope-challenge** / **events-write-missing** / **reauth-widened-scopes** / **cousins**.

Cousins cite-only (NOT primary):

- [#19066](https://github.com/anthropics/claude-code/issues/19066) — locked; closed without a lasting fix. Primary stays #92518.
- [#28258](https://github.com/anthropics/claude-code/issues/28258) — locked; "resolved in the next release" (2026-03). Still repro on 2.1.258.
- [#44652](https://github.com/anthropics/claude-code/issues/44652) — locked; same behavior six weeks later on 2.1.92; a commenter confirmed it on 2.1.121.

## Live catalog path

`/catachresis/` is this static lexicographer-stamp scoring assay. Path `https://hermes-playground-green.vercel.app/catachresis/` and subdomain `https://catachresis.hermes-playground-green.vercel.app` are both fine. Demo works with no secrets and no live Claude sessions. Mark: `03:50 Sydney · catachresis · catalog #187 · #92518`. `?embed` or `?embed=1` hides chrome for the hub living featured well.

1. Idle **mislabeled** → client stamps EXPIRED over a 403 `insufficient_scope` challenge.
2. Seeded **scoped** → UI names the missing scope `events:write`.
3. Diagnostic **no-401** → no 401 ever returned; only two 403s.
4. Diagnostic **no-refresh** → zero `refresh_token` grants.
5. Diagnostic **token-still-valid** → ~55 min of 1h remaining.
6. Diagnostic **insufficient-scope-challenge** → WWW-Authenticate + JSON-RPC.
7. Diagnostic **events-write-missing** → `events:read` grant; `events_delete` 403.
8. Diagnostic **reauth-widened-scopes** → second `/authorize` widened scopes; not a refresh.
9. Diagnostic **cousins** → #19066 #28258 #44652 cite-only.
10. Assay UI: ink pads, EXPIRED overlay vs `insufficient_scope` headword, OAuth challenge strip, scope ledger, JSON-RPC / client-message panels.
11. Stay-off strip: Bourdon-tube gauge / Solecism grammar desk / diesel glow-plug / delayed-primer / CRT paging-storm / olive suppressor / latchkey board / vault coffer. Primary stays #92518.
12. **Score probes** walks the probe ticket and lights chips on the desk. Chip-switch every verdict. Paste or drop JSON. Desk simulator chips rewrite the stamp (mislabeled / scoped / challenge / ledger).

## How to score

Open `projects/catachresis/index.html` in a browser, or serve the repo root and visit `/catachresis/` (Vercel rewrite → `/projects/catachresis`). No build step.

```bash
# No live Claude sessions. The living page scores probes in-browser.
# Do not claim this guard ships in Claude Code.
node --test projects/catachresis/hook/catachresis.test.mjs
```

Empty paste scores the idle **mislabeled** ticket if you admit mislabeled. Paste a probe on the page or drop a fixture from `data/`. The living page admits **mislabeled** / 403 `insufficient_scope` / #92518.

## Hook

`projects/catachresis/hook/` scores a probe `{ seed, mislabeled, scoped, status, wwwAuthenticate, clientMessage, http401, refreshAttempted, tokenRemainingMin, challengeError, challengeScope, reauthWidened }` and returns `{ verdict, reasons[], mislabeled, scoped, chips[], challenge }`. See `hook/README.md`.

```bash
node projects/catachresis/hook/index.mjs projects/catachresis/data/92518.json
echo '{"seed":"scoped","scoped":true,"namesMissingScope":true,"challengeError":"insufficient_scope"}' | node projects/catachresis/hook/index.mjs
```

`scoped` is true ONLY when the verdict is scoped (the stamp already names the missing scope). Seeded 92518 numbers must produce mislabeled / `scoped=false` on the EXPIRED overlay. A mislabeled stamp is never the hold path.
