# Binnacle

Ship's brass binnacle / compass house / night chart table for a real Claude Code failure class: **the interactive TUI still probes magnetic north (`api.anthropic.com`) after a gyro heading (`ANTHROPIC_BASE_URL`) is already named**. In a deny-by-default sandbox the only legal route is the named gateway. `claude -p` on the same config works. Interactive TUI refuses to start unless it can reach `api.anthropic.com` directly (`GET /api/oauth/profile`, `GET /api/hello`, `POST /api/event_logging/v2/batch`). `/api/hello` is sent to both; the other two are not. Same check is advisory in `-p` and fatal in TUI. With a proxy env set, the error names the proxy, never the configured base URL.

A named heading is not a hold. Score the binnacle or admit **housed**.

Idle word: **housed** (named gyro heading; TUI starts via that origin; no magnetic knock required for startup).
NEVER use the product name binnacle / empty / silent / magnetic / gyro / origin as the idle/state word.
NEVER reuse prior idles: beamed, snug, hung, appointed, cinched, gauged, stamped, overrun, pratique, wound, bound, stilled, stabled, drained, flat, fit, spoilt, laid, unlinked, tight, banked, roosted, stocked, seated, heard, clear, paired, kernel, latched, upheld, sterling, home, valid, dry, sealed, quiet, seised, rung.

Verdicts: **housed**, **swung**, **refused**, **printed**, **split**, **fatal**, **demanded**, **blind**, **boxed**, **stripped**. Slack alarm on swung / refused / fatal / split / blind / boxed / demanded / stripped. Linear ticket on refused / swung. GitHub binnacle-ledger of scored headings on every score.

The #90551 refused (BASE_URL set and serving `/v1/messages`, `claude -p` works, TUI refuses because `api.anthropic.com` is unreachable) is **refused**, never **housed**, even when the gateway-serves and -p lamps stay lit.

## Why not a clone

NOT **Visa** — MCP OAuth missing resource.
NOT **Husk** — hollow headless SUCCESS. Inverse: here headless works, interactive dies.
NOT **Sprag** / **Reed** — MCP lifecycle.
NOT **Gasket** — sandbox allowlist discard. Sandbox is the scene; the defect is the check consulting a host it was configured not to use.
NOT **Tain** — Chrome pairing.
NOT Tocsin / Reveille / Leat / Fusee — wake / schedule / sleep poles.
NOT leftover woodworking / millimetre-slider products.
Do NOT ship alternate names Tocsin, Larum, Clapper, Gland, Pigeonhole, Compass, Gyro, Magnet. Product name is **Binnacle** only.

Different problem: NAMED GYRO HEADING → TUI STILL KNOCKS MAGNETIC NORTH → FATAL IN INTERACTIVE, ADVISORY IN `-p` → ERROR NAMES THE PROXY, NEVER THE BASE URL.
Different UI: ship's brass binnacle / night chart table. Two compass cards under a lamp: MAG (`api.anthropic.com`) vs GYRO (`ANTHROPIC_BASE_URL`). The lamp should burn over GYRO; it still burns over MAG.
Different idle word: **housed**.

## Live catalog path

`/binnacle/` is this static ship's binnacle. Night chart table, brass compass house, MAG vs GYRO cards, oil lamp, night-order board. Demo works with no secrets and no npm. Mark: `20:50 Sydney · binnacle`.

1. Seeded `#90551` **refused** is already on the chart: BASE_URL set, gateway serves `/v1/messages`, `-p` works, TUI refuses because `api.anthropic.com` is unreachable → **refused**.
2. Switch **swung** — TUI still probes `api.anthropic.com` despite named BASE_URL → **swung**.
3. Switch **fatal** — check is fatal in TUI, only advisory in `-p` → **fatal**.
4. Switch **split** — `/api/hello` honors BASE_URL; oauth/profile and event_logging do not → **split**.
5. Switch **blind** — error names the proxy, never the configured base URL → **blind**.
6. Switch **boxed** — deny-by-default sandbox; only legal route is the named gateway → **boxed**.
7. Switch **demanded** — startup requires a full trusted-TLS HTTP response from the public origin → **demanded**.
8. Switch **stripped** — injected gateway origin has the path component stripped → **stripped**.
9. Switch **printed** — `claude -p` on the same config works → **printed**.
10. Switch **control housed** — TUI starts on the named origin, no magnetic knock → **housed**.
11. Switch **Reset · housed** — idle chart → **housed**. Idle word is **housed** when the chart is reset. One lamp stays on the gyro card; never an empty or error state.
12. **Score** scores. **Admit housed** scores honestly. **Reset · housed** returns idle housed. **Restore · #90551** shows the refused heading. Admit does not lie: a refused/swung binnacle stays refused/swung.

## Hook

`projects/binnacle/hook/` scores a probe `{ session, issue, source, baseUrl, publicOriginReachable, namedGatewayServesMessages, interactiveTuiStarts, headlessPrintWorks, helloToBaseUrl, helloToPublic, oauthProfileToPublic, eventLoggingToPublic, checkFatalInTui, checkAdvisoryInPrint, errorNamesProxy, errorNamesBaseUrl, pathStripped, denyByDefaultSandbox, scored }` and returns `{ verdict, reasons[], housed }`. See `hook/README.md`.

```bash
node projects/binnacle/hook/index.mjs --listen 9090
node --test projects/binnacle/hook/binnacle.test.mjs
```

## Evidence (do not invent more)

Primary:

- [anthropics/claude-code#90551](https://github.com/anthropics/claude-code/issues/90551) — open, has repro, filed 2026-08-29, area:tui/networking, Claude Code 2.1.251. Interactive TUI still probes `api.anthropic.com` after `ANTHROPIC_BASE_URL` is named. `claude -p` on the same config works. TUI refuses unless it can reach the public origin directly.

Same-class / nearby (not new primaries):

- [anthropics/claude-code#89211](https://github.com/anthropics/claude-code/issues/89211) — custom BASE_URL still assumed Anthropic-native.
- [anthropics/claude-code#88345](https://github.com/anthropics/claude-code/issues/88345) — settings env ignored; desktop injects origin with path stripped.
- [anthropics/claude-code#89972](https://github.com/anthropics/claude-code/issues/89972) — gateway `/v1/models` silently replaces Workflow `agent()` model ids.
- [anthropics/claude-code#89973](https://github.com/anthropics/claude-code/issues/89973) — feedback UX still offers send while channel is client-disabled.
- [anthropics/claude-code#88536](https://github.com/anthropics/claude-code/issues/88536) — custom-BASE_URL empty text blocks persisted then 400 on first-party replay.

Cross-check nearby bugs are DIFFERENT (cite only as “not this”):

- NOT Visa MCP OAuth missing resource.
- NOT Husk hollow headless SUCCESS.
- NOT Sprag / Reed MCP lifecycle.
- NOT Gasket sandbox allowlist discard.
- NOT Tain Chrome pairing.

Cross-ecosystem (nearby origin-split / unnamed custom base, not a new primary):

- [openai/codex#36597](https://github.com/openai/codex/issues/36597) — custom `openai_base_url` intercepts native traffic (inverse polarity).
- [openai/codex#40435](https://github.com/openai/codex/issues/40435) — connection-refused does not name unreachable custom base URL.
