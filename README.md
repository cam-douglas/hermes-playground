# hermes-playground

A catalog of self-contained daily projects. The leftover-instrument era is closed.

**Featured: [Quench](https://hermes-playground-green.vercel.app/quench/)** — runtime fuse. Trip a hard kill, fire Slack, write the GitHub spend ledger. Folder: `projects/quench/`.

**Listed: [Scrim](https://hermes-playground-green.vercel.app/scrim/)** — runtime DLP at the agent I/O boundary. Folder: `projects/scrim/`. Still listed. Not featured.

**Listed: [Knock](https://hermes-playground-green.vercel.app/knock/)** — fail-loud relay for stalled agent permission grants. Folder: `projects/knock/`. Still listed. Not featured.

Hub: `/` on the Vercel host. Projects: one folder each under `projects/`.

## Tree

```
README.md                 catalog index (this file)
catalog.json              3 products: Quench (featured), Scrim, Knock
index.html                hub page at `/` (filesystem hit; not a product)
hub/                      same catalog page at `/hub/`
projects/quench/          runtime token-burn fuse (featured)
projects/scrim/           agent I/O DLP (kept, unfeatured)
projects/knock/           permission-gate relay (kept, unfeatured)
vercel.json               path routes before filesystem so `/quench/`, `/scrim/`, `/knock/` reach products
runs/hours.json           ship log index
runs/2026-08-28-quench.md Quench ship log (00:50 Sydney)
runs/2026-08-27-scrim.md  Scrim ship log (23:50 Sydney)
runs/2026-08-27-knock.md  Knock ship log
runs/2026-08-27-reset.md  leftover era closed
```

## How a project lives

Each project is only its own folder:

```
projects/<slug>/
  index.html              (or whatever that project needs)
```

Rules:

- Put **only** that project's content in `projects/<slug>/`.
- Do not add leftover millimetre sliders, packed-sky lattices, or shared desk chrome.
- Slug is URL-safe. Reserved: `hub`, `runs`, `projects`.
- Register the project in `catalog.json` so the hub can list it.

## Quench

`projects/quench/` is a runtime token-burn circuit breaker. Interactive agent sessions have no fuse: subagent fan-out empties Max windows while UI banners keep talking. Quench trips a hard kill, fires Slack, and writes a GitHub spend ledger.

Live path: https://hermes-playground-green.vercel.app/quench/

Demo mode needs no Slack / GitHub / Linear secrets and no npm. A seeded 82-agent runaway is already on the copper. Idle word is **cool**, not the product name. Not a grant inbox. Not a DLP veil.

## Scrim

`projects/scrim/` is runtime DLP at the agent I/O / PostToolUse boundary. Paste or load a `tool_result`. The veil redacts key-shaped tokens with stable `sha256[0:8]` forensic ids, then writes Slack / GitHub / Linear ledger rows (demo if no secrets).

Live path: https://hermes-playground-green.vercel.app/scrim/

Demo mode needs no Slack / GitHub / Linear secrets and no npm. Seed leak is synthetic. Not a grant inbox.

## Knock

`projects/knock/` is a permission-gate relay (unfeatured on the hub, still shipped). An agent hook posts a grant request. The inbox shows who is knocking, the tool, and a TTL. Approve is scoped to that run. If nobody answers, Knock denies loud.

Live path: https://hermes-playground-green.vercel.app/knock/

Demo mode needs no Slack / GitHub / Linear secrets. Open the inbox, knock the gate, approve / deny / wait for timeout.

## Hosting

Production host: `https://hermes-playground-green.vercel.app`.

- `/` → hub (unconditional; the apex is not a project slug)
- `/quench/` → `projects/quench/`
- `/scrim/` → `projects/scrim/`
- `/knock/` → `projects/knock/`

Host wildcards for `*.hermes-playground-green.vercel.app` were removed: they do not resolve on `vercel.app`, and Vercel treated the apex host itself as slug `hermes-playground-green`, 404ing `/`. Products are served on catalog paths until a separate Vercel project assigns a real `*.vercel.app` host.

## Hub

`hub/index.html` reads `catalog.json` and lists cards. It is the catalog index, not a product.
