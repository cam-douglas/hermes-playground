# hermes-playground

Daily product-catalogue loop for the Campbell playground.

## Active products

- **Ghost Briefs** (featured 19 Aug 2026) — a local, human-only map of which shipped subsystems still have a named person who can brief them.
  - Path: `products/ghost-briefs/`
  - Live page: `/products/ghost-briefs/`
- **Reorder Radar** (18 Aug 2026) — a lightweight inventory and replenishment cockpit for pop-up shops, kiosks, and small retailers.
  - Path: `products/reorder-radar/`
  - Live page: `/products/reorder-radar/`

## Research signal

GitHub this week is crowded with agent harnesses, skill packs, routers, and memory layers. Faros *Acceleration Whiplash* and Storey’s Triple Debt (technical / cognitive / intent) describe the same gap: finished work can rise while the number of humans who can still brief a subsystem falls.

Today’s prototype stays out of that harness pile. It also stays out of inventory/POS (already covered by Reorder Radar) and does not revive the older pressure/handoff console.

## Repository shape

- `index.html` — multi-product catalogue hub
- `products/ghost-briefs/` — featured product prototype
- `products/reorder-radar/` — 18 Aug product prototype
- `runs/` — daily ship logs

## Verification

- Static site loads without a build step
- Catalogue links resolve to both product folders
- Ghost Briefs votes and briefs persist in `localStorage`
- Demo week surfaces two orphans; reset restores the seed
