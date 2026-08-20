# Kit Weight

A packing list hides the load. Put the kit in the bag. See the grams.

This is not Offcut. Offcut answers “what length is left on the stick.” Kit Weight answers “what mass is left in the bag.” Not millimetres. Not SKUs. Not rooms. One bag, packed items, leftover capacity.

## Problem

A packing list is a column of grams. The load lives in the bag:

- how heavy is the kit already?
- what capacity is left?
- which items still sit in the tray?
- which item will not fit unless you raise capacity?
- what does over-capacity look like on the bag itself?

Existing tools in this catalogue map leftover millimetres, SKU reorder tables, and empty booked rooms. They do not put mass in a bag.

## Users

- people packing a daypack who already know the items and need the grams visible
- anyone who refuses to treat a packing list as the product
- travellers who want leftover capacity as a picture, not a spreadsheet
- teams that want a no-backend, local-only pass — not a cut list, not an inventory cockpit, not a floor plan

## Workflow

1. Load the seed: a 7000 g daypack with laptop, charger, bottle, jacket, book, shoes, snack, headphones, power bank, and tripod already packed
2. Read the bag: fill height is packed grams against capacity; leftover capacity sits above the fill
3. Click a tray item to put it in the bag
4. Click a packed item on the fill or in the bag list to return it to the tray
5. An item heavier than remaining capacity stays in the tray marked won't-fit
6. Capacity is a number input. Adding one custom item (name + grams) is a secondary control

## Data model

Each item:

- `id` — stable local id
- `name` — short label
- `grams` — mass
- `packed` — whether it is in the bag

Derived gauge:

- packed grams
- remaining grams (capacity minus packed; may go negative if capacity is lowered)
- item count
- won't-fit flags on tray items that exceed remaining capacity

Nothing is persisted. Refresh restores the seeded partial pack.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG bag / daypack silhouette
- fill height maps packed grams to capacity
- no network, no npm, no localStorage

## UX

- one bag, not a spreadsheet, not a Gantt, not a floor plan, not a stock bar of millimetres
- tray of unplaced items; click to pack, click the fill or the bag list to unpack
- over-capacity is a fill past the capacity line plus warning copy
- live packed g, remaining g, and item count
- keyboard packs or unpacks the focused item
- SVG text alternative reports packed and remaining grams

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/kit-weight/`

## Verification

- page loads in a browser without build tooling
- one SVG bag is in the DOM
- packed g and remaining g are visible
- seeded items exist; a partial pack is already in the bag
- packing a tray item increases packed g
- unpacking restores it
- an oversized item is marked won't-fit, or over-capacity is shown
- a capacity line exists
- no paste-well hero, no room plan, no SKU table, no millimetre stick
