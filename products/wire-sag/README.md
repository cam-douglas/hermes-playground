# Wire Sag

A span looks tight until you see the dip. Two poles. One cable. See the sag.

This is not Plumb. Plumb is a true vertical against a wall. This is not Offcut. Offcut is leftover millimetres on a stick. This is not Mix Bus. Mix Bus is faders on a bus. Wire Sag answers “how much does this span dip in the middle.”

## Problem

A span looks tight until you see the dip:

- how far apart are the poles?
- how much does the cable drop at midspan?
- what leftover sag sits in the middle?
- what happens if the span stretches?

Existing tools in this catalogue hang a bob, leftover millimetres on a stick, mix channels, weigh claims, fold a sheet, and pack grams. They do not hang a cable between two poles.

## Users

- people who already know a line can look taut and still sag
- anyone who refuses to treat a paste of survey notes as the product
- desks that want the leftover dip as a picture, not a scorecard
- teams that want a no-backend, local-only pass — not a plumb, not leftover millimetres on a stick, not a mix

## Workflow

1. Load the seed: 20 m span, already too much sag at 2.4 m
2. Read the hang: two poles, one cable, a noticeable dip at midspan
3. Move the sag (or use the arrow keys on the focused slider); the curve redraws
4. Stretch the span; the poles move apart
5. Reset restores the seeded dip

## Data model

One span:

- `span` — metres between poles (default 20)
- `sag` — metres of dip at midspan (default 2.4)

Derived picture:

- a parabola close to a catenary between the pole tops
- sketch horizontal tension H ≈ (w · S²) / (8 · d), labelled as a sketch, not a sign-off
- the leftover is the sag in the middle

Nothing is persisted. Refresh restores the seeded hang.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG: two poles and a hanging cable
- sag redraws the curve; span stretches the poles
- no network, no npm, no localStorage

## UX

- one hang, not a spreadsheet, not a Gantt, not a floor plan, not a stock bar, not a bag, not a crease diagram, not a claims beam, not a mixer, not a plumb bob, not a clock
- seeded demo already shows a noticeable dip
- live span metres and midspan sag
- keyboard moves the focused control
- SVG text alternative names span and midspan sag
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/wire-sag/`

## Verification

- page loads in a browser without build tooling
- one SVG with two poles and a cable is in the DOM
- seeded sag is visible
- changing sag redraws the curve
- changing span moves the poles
- no paste-well hero, no plumb bob, no stock bar, no mix
