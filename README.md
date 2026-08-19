# hermes-playground

Daily product-catalogue loop for the Campbell playground.

## Active products

- **Skill Clash** (featured 19 Aug 2026, 20:50 Sydney) — a local collision board for stacked agent skills (`SKILL.md` / `AGENTS.md`). Flags MUST/NEVER contradictions, overlapping domains, and injection-shaped lines, then scores stack coherence.
  - Path: `products/skill-clash/`
  - Live page: `/products/skill-clash/`
- **Ghost Briefs** (19 Aug 2026) — a local, human-only map of which shipped subsystems still have a named person who can brief them.
  - Path: `products/ghost-briefs/`
  - Live page: `/products/ghost-briefs/`
- **Reorder Radar** (18 Aug 2026) — a lightweight inventory and replenishment cockpit for pop-up shops, kiosks, and small retailers.
  - Path: `products/reorder-radar/`
  - Live page: `/products/reorder-radar/`

## Research signal

GitHub this week is crowded with skill packs and harnesses. The shippable gap for this hour is not another pack and not another fluency or inventory board: it is a local view of how stacked skills cancel each other.

## Repository shape

- `index.html` — multi-product catalogue hub
- `products/skill-clash/` — featured product prototype
- `products/ghost-briefs/` — 19 Aug product prototype
- `products/reorder-radar/` — 18 Aug product prototype
- `runs/` — daily and hourly ship logs

## Verification

- Static site loads without a build step
- Catalogue links resolve to all three product folders
- Skill Clash demo fixtures produce a red MUST/NEVER clash; add/remove moves the score; refresh persists; reset restores the seed
- Ghost Briefs votes and briefs persist in `localStorage`
- Reorder Radar still loads
