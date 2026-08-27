# hermes-playground

A catalog of self-contained daily projects. The leftover-instrument era is closed. The catalog is empty and ready to start again.

Hub: `/` on the Vercel host. Projects: one folder each under `projects/`.

## Tree

```
README.md                 catalog index (this file)
catalog.json              0 products; schema for future entries
hub/                      public catalog page (not a product)
projects/                 future projects nest here, one folder each
vercel.json               hub + per-project host and path routing
runs/hours.json           reset log index
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

## How to add one

1. Create `projects/<slug>/` with that project's files.
2. Append one entry to `catalog.json` `products` (schema below).
3. Ship. The hub card links to the project's host and to the path fallback.

Do not put a new project at the repo root or under `products/`. That folder is gone.

## catalog.json schema

`products` is an array. Each entry needs at least:

| Field | Meaning |
|---|---|
| `name` | Display name |
| `slug` | Folder name under `projects/` |
| `summary` | One-line hub description |
| `day` | `YYYY-MM-DD` |
| `subdomain` | Preferred host URL |
| `href` | Path fallback, `/<slug>/` |
| `featured` | `true` to highlight on the hub |

Example (do not add until a real project ships):

```json
{
  "name": "Example",
  "slug": "example",
  "summary": "A self-contained daily project.",
  "day": "2026-08-28",
  "subdomain": "https://example.hermes-playground-green.vercel.app",
  "href": "/example/",
  "featured": true
}
```

The `schema` object in `catalog.json` documents the same fields. Keep `"products": []` until the first new project exists.

## Hosting

Production host today: `https://hermes-playground-green.vercel.app`.

**Path fallback (works now).** `vercel.json` serves:

- `/` → `hub/`
- `/<slug>/` → `projects/<slug>/`

A card on the hub can open `https://hermes-playground-green.vercel.app/<slug>/`.

**Host routing (preferred, not live on `*.vercel.app`).** `vercel.json` also rewrites `https://<slug>.hermes-playground-green.vercel.app` to `projects/<slug>/`. That host pattern is the intended URL in `subdomain`. It will not resolve on its own.

Vercel does **not** issue wildcard subdomains under `*.vercel.app`. You cannot attach `*.hermes-playground-green.vercel.app` in the project domain list. Nested hosts like `example.hermes-playground-green.vercel.app` are not assignable.

To give a project its own host, pick one of these:

1. **Extra Vercel project (no custom domain).** New project, same repo, Root Directory = `projects/<slug>`. Vercel assigns a real `*.vercel.app` URL. Put that URL in `subdomain`.
2. **Custom domain with a wildcard.** Add a domain you own to this project, then add `*.your-domain`. Point nameservers at Vercel so wildcard TLS can issue. Update the host matchers in `vercel.json` from `hermes-playground-green.vercel.app` to `your-domain`. Then `https://<slug>.your-domain` can serve `projects/<slug>/`.

Do not invent an apex domain this repo does not have. Until one of those steps is done, use the path fallback.

## Hub

`hub/index.html` is the public catalog. It reads `catalog.json` and lists cards. Each card links to `subdomain` and to `href`. With 0 products it says the catalog is empty and starting over.
