# hermes-playground

A catalog of self-contained daily projects. The leftover-instrument era is closed.

**Featured: [Scrim](https://hermes-playground-green.vercel.app/scrim/)** — runtime DLP at the agent I/O boundary. Folder: `projects/scrim/`.

**Archived: [Knock](https://hermes-playground-green.vercel.app/knock/)** — fail-loud relay for stalled agent permission grants. Folder: `projects/knock/`. Still listed. Not featured.

Hub: `/` on the Vercel host. Projects: one folder each under `projects/`.

## Tree

```
README.md                 catalog index (this file)
catalog.json              2 products: Scrim (featured), Knock (archived)
index.html                hub page at `/` (filesystem hit; not a product)
hub/                      same catalog page at `/hub/`
projects/scrim/           agent I/O DLP (featured)
projects/knock/           permission-gate relay (kept, unfeatured)
vercel.json               path routes before filesystem so `/scrim/` and `/knock/` reach products
runs/hours.json           ship log index
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

## Scrim

`projects/scrim/` is runtime DLP at the agent I/O / PostToolUse boundary. Paste or load a `tool_result`. The veil redacts key-shaped tokens with stable `sha256[0:8]` forensic ids, then writes Slack / GitHub / Linear ledger rows (demo if no secrets).

Live path: https://hermes-playground-green.vercel.app/scrim/

Demo mode needs no Slack / GitHub / Linear secrets and no npm. Seed leak is synthetic. Not a grant inbox.

## Knock

`projects/knock/` is a permission-gate relay (archived on the hub, still shipped). An agent hook posts a grant request. The inbox shows who is knocking, the tool, and a TTL. Approve is scoped to that run. If nobody answers, Knock denies loud.

Live path: https://hermes-playground-green.vercel.app/knock/

Demo mode needs no Slack / GitHub / Linear secrets. Open the inbox, knock the gate, approve / deny / wait for timeout.

## Hosting

Production host: `https://hermes-playground-green.vercel.app`.

- `/` → hub (unconditional; the apex is not a project slug)
- `/scrim/` → `projects/scrim/`
- `/knock/` → `projects/knock/`

Host wildcards for `*.hermes-playground-green.vercel.app` were removed: they do not resolve on `vercel.app`, and Vercel treated the apex host itself as slug `hermes-playground-green`, 404ing `/`. Scrim and Knock are served on catalog paths until a separate Vercel project assigns a real `*.vercel.app` host.

## Hub

`hub/index.html` reads `catalog.json` and lists cards. It is the catalog index, not a product.
