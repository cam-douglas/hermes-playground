# Stub

The cut is done, but a short remnant stub still sits. Move the leftover stub. See the residual short stub still sitting after a cut.

This is not Proud. Proud is a high strip standing above the surrounding face. This is not Overcut. Overcut is extra run past a stop. This is not Nick. Nick is a V-shaped bite in a cut edge. This is not Chip. Chip is a discrete chisel flake. This is not a plug. This is not a clock. This is not cut advice. This is not a mill sign-off. Stub answers “how much leftover remnant stub still sits after the cut.”

## Problem

The cut is done, but a short remnant stub still sits:

- how much leftover sitting stub still sits after the cut?
- is the leftover flush, or showing?
- when is the leftover stub obvious — as a sketch, not a mill sign-off?

Existing tools in this catalogue measure leftover creep, leftover scuff, leftover dent, leftover gouge, leftover nick, leftover chip, leftover overcut, leftover proud, leftover packed sky, leftover desk-keys, leftover desk-pins. They do not show leftover stub — leftover short remnant still sitting after a cut, not Proud leftover high strip, not Overcut leftover extra run past a stop, not Nick leftover V-bite, not Chip leftover chisel flake.

## Users

- people who already know a cut can still leave one leftover stub sitting after the cut as a short remnant
- anyone who refuses to treat a proud high strip, an overcut past a stop, a nick V-bite, a chip flake, a packed sky, or a clock as this leftover
- desks that want stub as a sketch, not a mill sign-off, and not cut advice
- teams that want a no-backend, local-only pass — not Proud, not Overcut, not Nick, not a paste well

## Workflow

1. Load the seed: 4 mm of leftover stub — already showing, not a flush-only cut
2. Read the scene: one workpiece, one fixed cut, a leftover whose leftover is one leftover short remnant still sitting after that cut, leftover labelled as a sketch
3. Move leftover stub (or use the arrow keys on the focused slider); leftover names showing or flush
4. Drop the leftover toward 0 mm and the cut looks flush / no leftover stub; raise it and a longer leftover stub still sits after a fixed cut
5. Reset restores the seeded leftover showing

## Data model

One workpiece with leftover stub as leftover short remnant that still sits after the cut:

- `stub` — millimetres of leftover sitting stub remnant after the cut (default 4)

Derived picture:

- leftover labelled as a sketch (flush / showing), not a mill sign-off
- leftover stub labelled as a sketch
- flush / no leftover stub when stub ≤ 1 mm (integer slider means 0 or 1)

Nothing is persisted. Refresh restores the seeded scene. Empty state is named flush — not “stub”.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: one workpiece with a fixed cut and one leftover short remnant stub still sitting after that cut (not a proud high strip, not an overcut past a stop, not a nick V-bite, not a chip flake)
- moving a control redraws the leftover immediately; the cut does not move
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- leftover short remnant still sitting after a fixed cut, not a proud high strip as the hero, not an overcut as the hero, not a nick as the hero, not a chip as the hero, not a clock
- seeded demo already shows a visible leftover (not a flush-only cut)
- live leftover stub, leftover labelled as a sketch (flush / showing)
- keyboard moves the focused control
- SVG text alternative names whether the stub is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/stub/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (one workpiece / leftover short remnant still sitting after a fixed cut) is in the DOM
- seeded leftover is visible (showing — not flush)
- changing a control redraws and updates the readout; the cut stays fixed
- empty state is named flush — not “stub”
- no paste-well hero, no proud as the hero, no overcut as the hero, no nick as the hero, no chip as the hero, no clock face
