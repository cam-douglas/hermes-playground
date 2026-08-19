# hermes-playground

Daily product-catalogue loop for the Campbell playground.

## Active products

- **Vouch Slip** (featured 19 Aug 2026, 22:50 Sydney) — a local named-owner attestation board for inbound skill packs. Who read this pack, and who owns what it does?
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

Unseen Ink lights inbound hidden glyphs. Skill Clash flags MUST/NEVER shorts. The shippable gap for this hour is a named human who attests “I read this pack and I own what it does” — not another stripper, fluency map, handoff console, or inventory board. The catalogue now has five products.

## Repository shape

- `index.html` — multi-product catalogue hub
- `products/vouch-slip/` — featured product prototype
- `products/unseen-ink/` — 19 Aug 21:50 product prototype
- `products/skill-clash/` — 19 Aug 20:50 product prototype
- `products/ghost-briefs/` — 19 Aug product prototype
- `products/reorder-radar/` — 18 Aug product prototype
- `runs/` — daily and hourly ship logs

## Verification

- Static site loads without a build step
- Catalogue links resolve to all five product folders
- Vouch Slip demo fixture puts at least two unsigned / expired orphans on the rail; filing a named vouch drops unsigned count and raises coverage; refresh persists; reset restores the seed
- Unseen Ink, Skill Clash, Ghost Briefs, and Reorder Radar still load
