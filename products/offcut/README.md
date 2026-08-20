# Offcut

Walls of millimetres hide the leftover. Place the cuts on the stick. See the offcut.

This is not Dark Floor. Dark Floor answers “which booked rooms are empty.” Offcut answers “what length is left on the stick.” Not rooms. Not holds. Not SKUs. One stock bar, placed cuts, leftover after kerf.

## Problem

A cut list is a column of numbers. The remainder lives on the stick:

- how long is the stock?
- what does the kerf take?
- which pieces still sit in the tray?
- what length is left as the offcut?
- which piece will not fit?

Existing tools in this catalogue map rooms, holds, and SKU tables. They do not put cuts on a stick.

## Users

- workshop people who already know the lengths and need the leftover visible
- anyone packing a 2400 mm bar without a spreadsheet
- people who refuse to paste a cut list as the primary act
- teams that want a no-backend, local-only pass — not an inventory cockpit, not a floor plan

## Workflow

1. Load the seed: a 2400 mm bar with 450, 600, and 900 already placed; leftover and kerf already drawn
2. Read the stick: placed cuts, kerf waste, and the offcut in a different fill
3. Click a tray piece to sit it in the first gap that fits (first-fit)
4. Click a placed piece on the bar to return it to the tray
5. Auto-pack sorts remaining pieces longest-first and packs; Clear bar returns every piece
6. A piece larger than the remaining gap stays in the tray marked won't-fit
7. Stock and kerf are number inputs. Adding one custom length is a secondary control

## Data model

Each piece:

- `id` — stable local id
- `length` — millimetres
- `start` — millimetre offset when placed, otherwise unset

Derived gauge:

- remaining millimetres (terminal offcut plus open gaps)
- waste millimetres (kerf slots)
- won't-fit flags on tray pieces that exceed the largest gap

Nothing is persisted. Refresh restores the seeded partial pack.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one horizontal SVG stock bar
- first-fit (and first-fit decreasing for Auto-pack) in-browser
- no network, no npm

## UX

- one stick, not a spreadsheet, not a Gantt, not a floor plan of rooms
- tray of unplaced lengths; click to pack, click the bar to unpack
- leftover offcut and kerf visually distinct from placed cuts
- live remaining mm and waste mm
- keyboard packs or unpacks the focused piece
- SVG text alternative reports remaining millimetres

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/offcut/`

## Verification

- page loads in a browser without build tooling
- one SVG stock bar is in the DOM
- remaining mm is visible
- seeded pieces exist; a partial pack is already on the bar
- packing a tray piece decreases remaining
- unpacking returns it to the tray
- a piece larger than remaining is marked won't-fit
- Auto-pack runs without error
- no paste-well hero, no room plan, no SKU table
