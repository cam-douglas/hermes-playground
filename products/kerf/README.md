# Kerf

A cut looks clean until you measure the gap. Move the kerf. See what the blade removed.

This is not Offcut. Offcut is remaining stock length after cuts are placed. This is not Grain. Grain is the angle of a cut versus the grain. This is not Fold Sheet. Fold Sheet is creases. This is not a clock. Kerf answers “how wide is the gap the blade itself removed.”

## Problem

A cut looks clean until you measure the gap:

- how wide is the kerf — the material the blade removes?
- how much area did that one cut eat, given the stock thickness?
- is the leftover the gap, or the remaining stick?
- when is the bite obvious — as a sketch, not a shop-floor sign-off?

Existing tools in this catalogue pack leftover millimetres on a stick, mismatch a cut against grain, and crease a sheet. They do not show the gap the blade ate.

## Users

- people who already know a clean cut still costs width
- anyone who refuses to treat remaining stock length, grain angle, or a clock as this leftover
- desks that want the removed gap as a picture, not a cut list
- teams that want a no-backend, local-only pass — not Offcut, not Grain, not a paste well

## Workflow

1. Load the seed: 4.5 mm kerf through 19 mm stock, 85.5 mm² gone
2. Read the plank: two stock faces and a hatched kerf gap the blade removed
3. Move kerf width or stock thickness (or use the arrow keys on the focused slider); leftover names the millimetres gone
4. Widen the bite and the gap grows; thicken the stock and the removed area grows
5. Reset restores the seeded leftover gap

## Data model

One cut:

- `kerf` — millimetres of gap the blade removes (default 4.5)
- `thickness` — millimetres of stock face (default 19)

Derived picture:

- removed area = kerf × thickness
- leftover = the kerf itself (material gone), not remaining stock length
- labelled as a sketch, not a shop-floor sign-off

Nothing is persisted. Refresh restores the seeded scene.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: a plank face with a single cut through it
- moving a control redraws the gap and the removed sliver immediately
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- one gap, not a spreadsheet, not a Gantt, not a night plan of rooms, not a cut-list stick, not a bag, not a crease diagram, not a claims beam, not a mixer, not a plumb bob, not a catenary, not a lamp, not a road crown, not a focus plane, not a partition, not a grain-angle dial, not a door, not talk columns, not gears, not a clock
- seeded demo already shows a visible removed leftover
- live kerf, removed area, leftover labelled as what the blade ate
- keyboard moves the focused control
- SVG text alternative names the kerf gap
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/kerf/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (plank + kerf gap) is in the DOM
- seeded leftover is visible (kerf 4.5, thickness 19, removed 85.5)
- changing a control redraws and updates the readout
- no paste-well hero, no remaining-length stick, no grain-angle dial, no clock face
