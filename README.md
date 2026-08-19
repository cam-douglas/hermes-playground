# hermes-playground

Daily product-catalogue loop for the Campbell playground.

## Active products

- **Reread Clock** (featured 19 Aug 2026, 23:50 Sydney) — a local half-life board for attestations that are still live while nobody has re-read the pack. Calendar expiry is the wrong signal. Trust decays by last open.
  - Path: `products/reread-clock/`
  - Live page: `/products/reread-clock/`
- **Vouch Slip** (19 Aug 2026, 22:50 Sydney) — a local named-owner attestation board for inbound skill packs. Who read this pack, and who owns what it does?
  - Path: `products/vouch-slip/`
  - Live page: `/products/vouch-slip/`
- **Unseen Ink** (19 Aug 2026, 21:50 Sydney) — a local inspector for inbound hidden Unicode in PRs, READMEs, and skill files. Lights ZWSP, bidi overrides, tag characters, and homoglyph-adjacent lookalikes instead of stripping them.
  - Path: `products/unseen-ink/`
  - Live page: `/products/unseen-ink/`
- **Skill Clash** (19 Aug 2026, 20:50 Sydney) — a local collision board for stacked agent skills (`SKILL.md` / `AGENTS.md`). Flags MUST/NEVER contradictions, overlapping domains, and injection-shaped lines, then scores stack coherence.
  - Path: `products/skill-clash/`
  - Live page: `/products/skill-clash/`
- **Ghost Briefs** (19 Aug 2026) — a local, human-only map of which shipped subsystems still have a named person who can brief them.
  - Path: `products/ghost-briefs/`
  - Live page: `/products/ghost-briefs/`
- **Reorder Radar** (18 Aug 2026) — a lightweight inventory and replenishment cockpit for pop-up shops, kiosks, and small retailers.
  - Path: `products/reorder-radar/`
  - Live page: `/products/reorder-radar/`

## Research signal

Vouch Slip answers who signed and when the slip expires. The shippable gap for this hour is a last-opened clock: a live vouch can sit unread for weeks. Trust should decay by last re-read — not another inspector, wax desk, fluency map, or inventory board. The catalogue now has six products.

## Repository shape

- `index.html` — multi-product catalogue hub
- `products/reread-clock/` — featured product prototype
- `products/vouch-slip/` — 19 Aug 22:50 product prototype
- `products/unseen-ink/` — 19 Aug 21:50 product prototype
- `products/skill-clash/` — 19 Aug 20:50 product prototype
- `products/ghost-briefs/` — 19 Aug product prototype
- `products/reorder-radar/` — 18 Aug product prototype
- `runs/` — daily and hourly ship logs

## Verification

- Static site loads without a build step
- Catalogue links resolve to all six product folders
- Reread Clock demo fixture puts at least two stale-but-signed clocks on the rail; marking a reread raises remaining % and drops stale count; refresh persists; reset restores the seed
- Vouch Slip, Unseen Ink, Skill Clash, Ghost Briefs, and Reorder Radar still load
