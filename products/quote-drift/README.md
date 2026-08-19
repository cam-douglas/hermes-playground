# Quote Drift

A local two-well paste instrument for quote vs invoice. The quote is a PDF from March. The invoice is from last Tuesday. Silent extras hide in the gap. Paste both ledgers, read the money delta, and see the lines that appeared.

This is not Unseen Ink. Unseen Ink answers “which hidden glyphs arrived.” Quote Drift answers “what money showed up after the quote.” Not Renew Trap (cancel-by dates). Not Reorder Radar (SKU stock). Paste two texts, see the drift.

## Problem

Quotes and invoices live in different months. A design-tool quote from March does not mention priority support, a seat bump, or a platform fee. The invoice from last Tuesday does. People still reconcile by eye:

- what was quoted?
- what was invoiced?
- which lines appeared in the gap?
- how much is the money delta?

Existing tools in this catalogue inspect unicode, notice windows, leftover access, and inventory. They do not put two money ledgers on one gauge.

## Users

- founders who signed a March quote and got an August invoice
- ops people who paste PDF text into a notes app to “just check the extras”
- anyone who needs a no-backend quote-vs-invoice pass before paying
- teams that want the extras-only list, not a vendor table

## Workflow

1. Load the seed / demo: a design-tool quote + seats vs an invoice that adds priority support, a seat bump, and a platform fee
2. Read the center gauge: quoted, invoiced, extras
3. Read the stacked strip: matched / changed / extra / missing
4. Click a bar segment to highlight the source line in the well
5. Swap wells if the paste landed on the wrong side
6. Copy extras-only
7. Reset restores the seed
8. Refresh keeps the last paste pair

## Data model

Each pasted ledger is raw text. Derived line items:

- `label` — text before the amount
- `amount` — parsed from `$1,234.00` or a trailing `1,234.00`
- `key` — normalized label (qty marks like `× 4` stripped) used to pair quote ↔ invoice
- `kind` — `matched` | `changed` | `extra` | `missing`

Derived totals:

- `quoted` — sum of quote line items (totals/subtotals skipped)
- `invoiced` — sum of invoice line items
- `extras / drift` — extras plus amount changes on paired lines

Persisted locally:

- last quote text, last invoice text, and mode (`seed` / `demo` / `paste`) in `localStorage`

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- simple regex line parser; no PDF library
- pairing and delta are in-browser
- `localStorage` for the last paste pair
- copy extras-only stays on-device

## UX

- two ledgers meeting in a drift gauge (dark, sharp — not a red rail of vendor rows, not a unicode UV board)
- left well: quote text; right well: invoice text
- center stage: money delta plus a stacked strip of matched / extra / missing / changed lines
- click a bar segment to light the source line in the well
- load seed/demo, swap wells, reset, optional copy of extras-only
- last paste pair persists across refresh

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/quote-drift/`

## Verification

- page loads in a browser without build tooling
- two paste wells are in the DOM
- seed/demo produces extras (priority support or platform fee visible) and a non-zero money delta
- reset restores the seed
- refresh persists the last paste pair
- no rail of 6+ data rows as the main UI
