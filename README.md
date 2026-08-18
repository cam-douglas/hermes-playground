# hermes-playground

Daily product-catalogue loop for the Campbell playground.

## Active product

- **Reorder Radar** — a lightweight inventory and replenishment cockpit for pop-up shops, kiosks, and small retailers.
- Path: `products/reorder-radar/`
- Live page: open the deployed site root, then follow the product link.

## Research signal

GitHub already has plenty of full inventory/POS systems (for example StockPilot, FlowStock, InvenTree, and other inventory-management repos), but many are heavy, multi-role, or ERP-shaped.

This prototype focuses on the sharper wedge:

- fast movers falling below reorder point
- stock coverage days vs supplier lead time
- a simple buy-now queue instead of a full ERP
- local-first state for tiny teams

## Repository shape

- `index.html` — catalogue hub
- `products/reorder-radar/` — self-contained product prototype

## Verification

- Static site loads without a build step
- Product state persists in `localStorage`
- Reorder recommendations are derived from stock, velocity, and lead time
