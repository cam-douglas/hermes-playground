# Reorder Radar

A local-first inventory and replenishment cockpit for pop-up shops, kiosks, and small retailers.

## Problem

Small retailers usually know what sold yesterday, but not what should be reordered today. Full POS/ERP stacks are often too heavy for a tiny team that just needs:

- low-stock detection
- reorder quantities
- supplier lead-time awareness
- a quick buy-now queue
- a simple, local-first workflow

## Users

- pop-up shop operators
- boutique retail managers
- kiosk owners
- small-store assistants

## Workflow

1. Load a stock list.
2. Watch items drift toward reorder threshold.
3. Adjust on-hand quantities after sales or receiving.
4. Review the buy-now queue.
5. Persist the state locally for the next shift.

## Data model

Each SKU tracks:

- `name`
- `category`
- `supplier`
- `onHand`
- `reorderPoint`
- `dailyRate`
- `leadDays`
- `unitCost`
- `shelf`

Derived values:

- `daysCover`
- `reorderQty`
- `status` (`safe`, `watch`, `buy now`)
- `urgency score`

## Verification

- page loads in a browser without build tooling
- stock edits persist after refresh
- reorder queue responds to on-hand changes
- add-item form updates the catalog immediately
