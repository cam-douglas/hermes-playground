# Dent

The face was struck, but a dent still sits. Move the leftover dent. See the residual shallow round crush still sitting in a fixed face after a blow.

This is not Bruise. Bruise is compression after pressure, often broader and flatter. This is not Gouge. Gouge is a curved hollow scooped by a carve. This is not Nick. Nick is a V bite in a cut edge. This is not Chip. Chip is a discrete flake from the chisel. This is not Cup. Cup is board cupping along the length. This is not impact advice. This is not a mill sign-off. Dent answers “how deep leftover round crush still sits in a fixed face after a blow.”

## Problem

The face was struck, but a dent still sits:

- how much leftover sitting dent still sits in a fixed face after a blow?
- is the leftover sprung, or showing?
- when is the leftover dent obvious — as a sketch, not a mill sign-off?

Existing tools in this catalogue measure leftover bruises, leftover carved gouges, leftover edge nicks, leftover chips, leftover packed sky, leftover desk-keys, leftover desk-pins. They do not show leftover dent — leftover shallow round crush still sitting in a fixed face after a blow, not Bruise leftover compression, not Gouge leftover scooped hollow, not Nick leftover V bite, not Chip leftover flake.

## Users

- people who already know a blow can still leave one leftover dent sitting in the face as a shallow round crush
- anyone who refuses to treat a bruise compression field, a carved gouge hollow, an edge nick V, a chip flake, a packed sky, or a clock as this leftover
- desks that want dent as a sketch, not a mill sign-off, and not impact advice
- teams that want a no-backend, local-only pass — not Bruise, not Gouge, not Nick, not a paste well

## Workflow

1. Load the seed: 3 mm of leftover dent — already showing, not a sprung-only face
2. Read the scene: one workpiece, one fixed face, a leftover whose leftover is one leftover round crush sitting in that face, leftover labelled as a sketch
3. Move leftover dent (or use the arrow keys on the focused slider); leftover names showing or sprung
4. Drop the leftover toward 0 mm and the face looks sprung / no leftover dent; raise it and a deeper leftover dent still sits in a fixed face
5. Reset restores the seeded leftover showing

## Data model

One workpiece with leftover dent as leftover shallow round crush that still sits in a fixed face after a blow:

- `dent` — millimetres of leftover sitting dent depth in a fixed face after a blow (default 3)

Derived picture:

- leftover labelled as a sketch (sprung / showing), not a mill sign-off
- leftover dent labelled as a sketch
- sprung / no leftover dent when dent ≤ 1 mm (integer slider means 0 or 1)

Nothing is persisted. Refresh restores the seeded scene. Empty state is named sprung — not “dent”.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: one workpiece with a fixed face and one leftover shallow round crush sitting in that face (not a bruise compression field, not a carved gouge hollow, not an edge nick V, not a chip flake)
- moving a control redraws the leftover immediately; the face does not move
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- leftover round crush sitting in a fixed face after a blow, not a bruise compression field as the hero, not a carved gouge as the hero, not an edge nick as the hero, not a chip flake as the hero, not a clock
- seeded demo already shows a visible leftover (not a sprung-only face)
- live leftover dent, leftover labelled as a sketch (sprung / showing)
- keyboard moves the focused control
- SVG text alternative names whether the dent is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/dent/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (one workpiece / leftover round crush sitting in a fixed face after a blow) is in the DOM
- seeded leftover is visible (showing — not sprung)
- changing a control redraws and updates the readout; the face stays fixed
- empty state is named sprung — not “dent”
- no paste-well hero, no bruise as the hero, no gouge as the hero, no nick as the hero, no chip as the hero, no clock face
