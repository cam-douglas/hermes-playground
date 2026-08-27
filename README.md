# hermes-playground

A catalog of self-contained daily projects. The leftover-instrument era is closed.

**First project: [Knock](https://hermes-playground-green.vercel.app/knock/)** — fail-loud relay for stalled agent permission grants. Folder: `projects/knock/`.

Hub: `/` on the Vercel host. Projects: one folder each under `projects/`.

## Tree

```
README.md                 catalog index (this file)
catalog.json              1 product: Knock
hub/                      public catalog page (not a product)
projects/knock/           permission-gate relay
vercel.json               hub + per-project path routing (apex `/` is hub)
runs/hours.json           ship log index
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

## Knock

`projects/knock/` is a permission-gate relay. An agent hook posts a grant request. The inbox shows who is knocking, the tool, and a TTL. Approve is scoped to that run. If nobody answers, Knock denies loud.

Live path: https://hermes-playground-green.vercel.app/knock/

Demo mode needs no Slack / GitHub / Linear secrets. Open the inbox, knock the gate, approve / deny / wait for timeout.

## Hosting

Production host: `https://hermes-playground-green.vercel.app`.

- `/` → hub (apex host is excluded from the slug wildcard; it is not a project)
- `/knock/` → `projects/knock/`

Wildcard `*.hermes-playground-green.vercel.app` does not work on `vercel.app`. Knock is therefore served on the catalog path until a separate Vercel project with Root Directory `projects/knock` assigns a real `*.vercel.app` host.

## Hub

`hub/index.html` reads `catalog.json` and lists cards. It is the catalog index, not a product.
