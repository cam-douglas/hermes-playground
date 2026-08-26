# Chip

The chisel has passed, but a chip still sits. Move the leftover chip. See the residual discrete chip of wood still sitting after a chisel cut.

This is not Tearout. Tearout is one splinter torn at the cut. This is not Dust. Dust is loose sawdust still in the cut. This is not Offcut. Offcut is the leftover piece of the board after the cut. This is not Burr. Burr is a ragged displaced lip along a cut. This is not Whisker. Whisker is leftover hair still standing at an edge after the plane. This is not Fuzz. Fuzz is a field of standing fibres after sanding. This is not Nib. Nib is a compact leftover at intersecting cuts. This is not chisel advice. This is not a mill sign-off. Chip answers “how large the leftover discrete chip of wood still sits after a fixed chisel cut.”

## Problem

The chisel has passed, but a chip still sits:

- how much leftover sitting chip still sits after a chisel cut?
- is the leftover cleared, or showing?
- when is the leftover chip obvious — as a sketch, not a mill sign-off?

Existing tools in this catalogue measure leftover splinters, leftover sawdust, leftover board pieces, leftover lips, leftover standing hair, leftover fibre fields, leftover corner projections, leftover packed sky, leftover desk-keys, leftover desk-pins. They do not show leftover chip — leftover discrete chip of wood that still sits after a fixed chisel cut, not Tearout leftover splinter, not Dust leftover sawdust, not Offcut leftover board piece, not Burr leftover lip, not Whisker leftover hair.

## Users

- people who already know a chisel cut can still leave one leftover chip sitting after the cut
- anyone who refuses to treat a torn splinter, a dust field, a leftover board piece, a burr lip, a standing hair, a packed sky, or a clock as this leftover
- desks that want chip as a sketch, not a mill sign-off, and not chisel advice
- teams that want a no-backend, local-only pass — not Tearout, not Dust, not Offcut, not a paste well

## Workflow

1. Load the seed: 6 mm of leftover chip — already showing, not a cleared-only cut
2. Read the scene: one workpiece, one fixed chisel cut, a leftover whose leftover is one discrete chip sitting after that cut, leftover labelled as a sketch
3. Move leftover chip (or use the arrow keys on the focused slider); leftover names showing or cleared
4. Drop the leftover toward 0 mm and the cut looks cleared / no leftover chip; raise it and a larger leftover chip still sits after a fixed chisel cut
5. Reset restores the seeded leftover showing

## Data model

One workpiece with leftover chip as leftover discrete chip of wood that still sits after a fixed chisel cut:

- `chip` — millimetres of leftover sitting chip size after a fixed chisel cut (default 6)

Derived picture:

- leftover labelled as a sketch (cleared / showing), not a mill sign-off
- leftover chip labelled as a sketch
- cleared / no leftover chip when chip ≤ 1 mm (integer slider means 0 or 1)

Nothing is persisted. Refresh restores the seeded scene. Empty state is named cleared — not “chip”.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: one workpiece with a fixed chisel cut and one leftover discrete chip of wood sitting after that cut (not a torn splinter, not a dust field, not a leftover board piece, not a burr lip, not a standing hair)
- moving a control redraws the leftover immediately; the cut does not move
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- leftover discrete chip of wood sitting after a fixed chisel cut, not a splinter as the hero, not dust as the hero, not an offcut as the hero, not a burr lip as the hero, not a standing hair as the hero, not a clock
- seeded demo already shows a visible leftover (not a cleared-only cut)
- live leftover chip, leftover labelled as a sketch (cleared / showing)
- keyboard moves the focused control
- SVG text alternative names whether the chip is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/chip/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (one workpiece / leftover chip sitting after a fixed chisel cut) is in the DOM
- seeded leftover is visible (showing — not cleared)
- changing a control redraws and updates the readout; the cut stays fixed
- empty state is named cleared — not “chip”
- no paste-well hero, no tearout as the hero, no dust as the hero, no offcut as the hero, no burr as the hero, no whisker as the hero, no clock face
