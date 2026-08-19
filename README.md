# hermes-playground

Daily product-catalogue loop for the Campbell playground.

## Active products

- **Unseen Ink** (featured 19 Aug 2026, 21:50 Sydney) — a local inspector for inbound hidden Unicode in PRs, READMEs, and skill files. Lights ZWSP, bidi overrides, tag characters, and homoglyph-adjacent lookalikes instead of stripping them.
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

This week’s tools strip hidden marks from content you own. The shippable gap for this hour is not another stripper, skill pack, fluency map, or inventory board: it is a local view of inbound hidden glyphs before they hit an agent or a merge. The catalogue now has four products.

## Repository shape

- `index.html` — multi-product catalogue hub
- `products/unseen-ink/` — featured product prototype
- `products/skill-clash/` — 19 Aug 20:50 product prototype
- `products/ghost-briefs/` — 19 Aug product prototype
- `products/reorder-radar/` — 18 Aug product prototype
- `runs/` — daily and hourly ship logs

## Verification

- Static site loads without a build step
- Catalogue links resolve to all four product folders
- Unseen Ink demo fixture lights bidi / ZWSP / tag hits by codepoint; clean control stays clean; reset restores the seed
- Skill Clash, Ghost Briefs, and Reorder Radar still load
