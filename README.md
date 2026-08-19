# hermes-playground

Daily product-catalogue loop for the Campbell playground.

The hub is a **catalogue desk**: live search, tags, and a this-hour vs archive split over the six existing products. No seventh product.

## Active products

- **Reread Clock** (featured this hour · shipped 19 Aug 2026, 23:50 Sydney) — a local half-life board for attestations that are still live while nobody has re-read the pack. Calendar expiry is the wrong signal. Trust decays by last open. Tags: trust, half-life, attestation.
  - Path: `products/reread-clock/`
  - Live page: `/products/reread-clock/`
- **Vouch Slip** (archive · 19 Aug 2026, 22:50 Sydney) — a local named-owner attestation board for inbound skill packs. Who read this pack, and who owns what it does? Tags: trust, attestation, inbound.
  - Path: `products/vouch-slip/`
  - Live page: `/products/vouch-slip/`
- **Unseen Ink** (archive · 19 Aug 2026, 21:50 Sydney) — a local inspector for inbound hidden Unicode in PRs, READMEs, and skill files. Lights ZWSP, bidi overrides, tag characters, and homoglyph-adjacent lookalikes instead of stripping them. Tags: unicode, inbound, review.
  - Path: `products/unseen-ink/`
  - Live page: `/products/unseen-ink/`
- **Skill Clash** (archive · 19 Aug 2026, 20:50 Sydney) — a local collision board for stacked agent skills (`SKILL.md` / `AGENTS.md`). Flags MUST/NEVER contradictions, overlapping domains, and injection-shaped lines, then scores stack coherence. Tags: skills, collision, review.
  - Path: `products/skill-clash/`
  - Live page: `/products/skill-clash/`
- **Ghost Briefs** (archive · 19 Aug 2026) — a local, human-only map of which shipped subsystems still have a named person who can brief them. Tags: fluency, ownership, handoff.
  - Path: `products/ghost-briefs/`
  - Live page: `/products/ghost-briefs/`
- **Reorder Radar** (archive · 18 Aug 2026) — a lightweight inventory and replenishment cockpit for pop-up shops, kiosks, and small retailers. Tags: inventory, ops.
  - Path: `products/reorder-radar/`
  - Live page: `/products/reorder-radar/`

## Research signal

Six prototypes on one page is already a pile. The missing local product is a way to find them: search, tags, and a this-hour vs archive split on the hub. Leave every product folder alone. The catalogue still has six products.

## Repository shape

- `index.html` — searchable catalogue hub (this hour vs archive, live search, tags)
- `products/reread-clock/` — featured this-hour product prototype
- `products/vouch-slip/` — archive product prototype
- `products/unseen-ink/` — archive product prototype
- `products/skill-clash/` — archive product prototype
- `products/ghost-briefs/` — archive product prototype
- `products/reorder-radar/` — archive product prototype
- `runs/` — daily and hourly ship logs

## Verification

- Static site loads without a build step
- Catalogue links resolve to all six product folders
- Search for `unicode` shows Unseen Ink and hides Reorder Radar
- Tag `inventory` shows only Reorder Radar
- Clearing search/tags restores all six
- Empty query `zzzz-no-match` shows an empty state that names the query
- Featured this-hour card for Reread Clock remains
- All six product pages still load
