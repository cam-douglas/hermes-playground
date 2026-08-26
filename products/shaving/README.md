# Shaving

The plane has passed, but a shaving still sits. Move the leftover shaving. See the residual curl of shaving still sitting after a plane pass.

This is not Chip. Chip is a discrete flake from the chisel. This is not Skip. Skip is a low missed patch after the planer. This is not Dust. Dust is loose sawdust in a kerf. This is not a whisker. This is not a clock. This is not planing advice. This is not a mill sign-off. Shaving answers “how much leftover shaving still sits after the plane.”

## Problem

The plane has passed, but a shaving still sits:

- how much leftover sitting shaving still sits after the plane?
- is the leftover brushed, or showing?
- when is the leftover shaving obvious — as a sketch, not a mill sign-off?

Existing tools in this catalogue measure leftover holiday, leftover stub, leftover creep, leftover skip, leftover chip, leftover whisker, leftover dust, leftover packed sky, leftover desk-keys, leftover desk-pins. They do not show leftover shaving — leftover residual curl of plane shaving still sitting after a plane pass, not Chip leftover flake, not Skip leftover low, not Dust leftover sawdust, not a whisker.

## Users

- people who already know a plane pass can still leave one leftover shaving sitting on the face as a residual curl
- anyone who refuses to treat a chip flake, a skip low, a dust field, a whisker, a packed sky, or a clock as this leftover
- desks that want shaving as a sketch, not a mill sign-off, and not planing advice
- teams that want a no-backend, local-only pass — not Chip, not Skip, not Dust, not a paste well

## Workflow

1. Load the seed: 3 mm of leftover shaving — already showing, not a brushed-only face
2. Read the scene: one workpiece, one plane pass that has already gone, a leftover whose leftover is one leftover residual curl of shaving still sitting after that plane, leftover labelled as a sketch
3. Move leftover shaving (or use the arrow keys on the focused slider); leftover names showing or brushed
4. Drop the leftover toward 0 mm and the face looks brushed / no leftover shaving; raise it and a larger leftover shaving curl still sits after a plane pass
5. Reset restores the seeded leftover showing

## Data model

One workpiece with leftover shaving as leftover residual curl that still sits after the plane:

- `shaving` — millimetres of leftover sitting shaving curl size after the plane (default 3)

Derived picture:

- leftover labelled as a sketch (brushed / showing), not a mill sign-off
- leftover shaving labelled as a sketch
- brushed / no leftover shaving when shaving ≤ 1 mm (integer slider means 0 or 1)

Nothing is persisted. Refresh restores the seeded scene. Empty state is named brushed — not “shaving”.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: one workpiece with a plane pass that has already gone and one leftover residual curl of shaving still sitting after that plane (not a chip flake, not a skip low, not a dust field, not a whisker)
- moving a control redraws the leftover immediately; the face does not move
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- leftover residual curl of shaving still sitting after a plane pass, not a chip flake as the hero, not a skip as the hero, not dust as the hero, not a whisker as the hero, not a clock
- seeded demo already shows a visible leftover (not a brushed-only face)
- live leftover shaving, leftover labelled as a sketch (brushed / showing)
- keyboard moves the focused control
- SVG text alternative names whether the shaving is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/shaving/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (one workpiece / leftover residual curl of shaving still sitting after a plane pass) is in the DOM
- seeded leftover is visible (showing — not brushed)
- changing a control redraws and updates the readout; the face stays fixed
- empty state is named brushed — not “shaving”
- no paste-well hero, no chip as the hero, no skip as the hero, no dust as the hero, no whisker as the hero, no clock face
