# Fold Sheet

A fold is a word until you see the creases. Choose the fold. See the sheet.

This is not Offcut. Offcut answers “what length is left on the stick.” This is not Kit Weight. Kit Weight answers “what mass is left in the bag.” Fold Sheet answers “where do the creases land, and which face sits outside.” Not millimetres. Not grams. Not rooms.

## Problem

A letter fold is a sentence until the sheet is in front of you:

- where do the two C-fold creases sit?
- which panel is the outside face?
- how does a Z-fold differ from a letter fold on the same thirds?
- what does a half or a gate do to the packet?

Existing tools in this catalogue map leftover millimetres, leftover grams, and empty booked rooms. They do not put creases on a sheet.

## Users

- people folding a letter who already know the name and need the creases visible
- anyone who refuses to treat a paragraph of fold instructions as the product
- print desks that want the packet as a picture, not a paste well
- teams that want a no-backend, local-only pass — not a cut list, not a bag of grams, not a floor plan

## Workflow

1. Load the seed: a portrait letter sheet already showing a C-fold (two parallel creases at one-third and two-thirds)
2. Read the sheet: crease lines, numbered panels, and a side-view packet of stacked thickness
3. Click a fold type — Letter (C), Z-fold, Half, Gate — to redraw the creases on the same sheet
4. The active type is pressed; the silhouette shows how the panels stack
5. Orientation and US Letter / A4 are secondary. They change the sheet, not the thesis

## Data model

Each fold type:

- `id` — letter, z, half, gate
- `name` — short label
- `panels` — face count
- `axis` — horizontal or vertical creases
- `lines` — crease positions as fractions of the fold axis
- `valley` — which creases fold toward you (C-fold: both; Z-fold: alternating)

Derived picture:

- crease count
- panel labels
- side-view stack (packet thickness)

Nothing is persisted. Refresh restores the seeded letter fold.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG sheet and one SVG side-view packet
- crease geometry is local
- no network, no npm, no localStorage

## UX

- one sheet, not a spreadsheet, not a Gantt, not a floor plan, not a stock bar, not a bag of grams
- fold-type chips redraw the creases; active chip is `aria-pressed`
- panels labelled so you can see which face lands outside
- a small folded silhouette shows the resulting packet
- keyboard changes fold type (chips, and arrow keys)
- SVG text alternative names the fold and panel count
- seeded letter fold is already a picture on load

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/fold-sheet/`

## Verification

- page loads in a browser without build tooling
- one SVG sheet is in the DOM
- letter / C-fold is the seed
- clicking Z-fold or Half changes crease lines
- a folded silhouette / side view is present
- no paste-well hero, no room plan, no millimetre stick, no bag of grams
