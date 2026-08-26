# Creep

The joint is closed, but a thin line of glue still sits. Move the leftover creep. See the residual late glue still sitting along a fixed seam after the clamp.

This is not Squeeze. Squeeze is fresh glue squeeze-out wiped along the seam at clamp-up. This is not Stain. Stain is a colour wash. This is not Drip. Drip is a run of finish. This is not Scuff. Scuff is an abraded mark. This is not glue advice. This is not a mill sign-off. Creep answers “how much leftover late glue still sits along a fixed seam after the clamp.”

## Problem

The joint is closed, but a thin line of glue still sits:

- how much leftover sitting creep still sits along a fixed seam after the clamp?
- is the leftover wiped, or showing?
- when is the leftover creep obvious — as a sketch, not a mill sign-off?

Existing tools in this catalogue measure leftover squeeze, leftover stain, leftover drip, leftover scuff, leftover packed sky, leftover desk-keys, leftover desk-pins. They do not show leftover creep — leftover late glue still sitting along a fixed seam after the clamp, not Squeeze leftover fresh beads, not Stain leftover colour wash, not Drip leftover run of finish, not Scuff leftover abraded mark.

## Users

- people who already know a clamp can still leave one leftover creep sitting along the seam as a thin late glue line
- anyone who refuses to treat a squeeze bead, a stain wash, a drip of finish, a scuff streak, a packed sky, or a clock as this leftover
- desks that want creep as a sketch, not a mill sign-off, and not glue advice
- teams that want a no-backend, local-only pass — not Squeeze, not Stain, not Drip, not a paste well

## Workflow

1. Load the seed: 2 mm of leftover creep — already showing, not a wiped-only seam
2. Read the scene: one workpiece, one fixed seam, a leftover whose leftover is one leftover thin glue line sitting along that seam, leftover labelled as a sketch
3. Move leftover creep (or use the arrow keys on the focused slider); leftover names showing or wiped
4. Drop the leftover toward 0 mm and the seam looks wiped / no leftover creep; raise it and a thicker leftover creep still sits along a fixed seam
5. Reset restores the seeded leftover showing

## Data model

One workpiece with leftover creep as leftover late glue that still sits along a fixed seam after the clamp:

- `creep` — millimetres of leftover sitting creep thickness along a fixed seam after the clamp (default 2)

Derived picture:

- leftover labelled as a sketch (wiped / showing), not a mill sign-off
- leftover creep labelled as a sketch
- wiped / no leftover creep when creep ≤ 1 mm (integer slider means 0 or 1)

Nothing is persisted. Refresh restores the seeded scene. Empty state is named wiped — not “creep”.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: one workpiece with a fixed closed seam and one leftover thin late glue line sitting along that seam (not a squeeze bead, not a stain wash, not a drip of finish, not a scuff streak)
- moving a control redraws the leftover immediately; the seam does not move
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- leftover thin late glue line sitting along a fixed seam after the clamp, not a squeeze bead as the hero, not a stain wash as the hero, not a drip as the hero, not a scuff as the hero, not a clock
- seeded demo already shows a visible leftover (not a wiped-only seam)
- live leftover creep, leftover labelled as a sketch (wiped / showing)
- keyboard moves the focused control
- SVG text alternative names whether the creep is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/creep/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (one workpiece / leftover thin late glue line sitting along a fixed seam after the clamp) is in the DOM
- seeded leftover is visible (showing — not wiped)
- changing a control redraws and updates the readout; the seam stays fixed
- empty state is named wiped — not “creep”
- no paste-well hero, no squeeze as the hero, no stain as the hero, no drip as the hero, no scuff as the hero, no clock face
