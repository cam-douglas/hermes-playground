# Burr

The cut is through, but the burr still stands. Move the leftover standing lip. See the residual burr still standing as a raised ragged lip along a finished cut.

This is not Nib. Nib is leftover compact projection at an inside corner of two intersecting cuts. This is not Fuzz. Fuzz is leftover standing fibres after sanding. This is not Tearout. Tearout is leftover one splinter at the cut. This is not Arris. Arris is leftover intended sharp edge. This is not Chatter. Chatter is leftover ripple. This is not Burn. Burn is leftover scorch. This is not filing advice. This is not a mill sign-off. Burr answers “how much leftover raised lip still stands along a finished cut.”

## Problem

The cut is through, but the burr still stands:

- how much leftover displaced material still stands as a raised ragged lip along a finished cut?
- is the leftover filed, or showing?
- when is the leftover burr obvious — as a sketch, not a mill sign-off?

Existing tools in this catalogue measure leftover corner nibs, leftover standing fibres, leftover single splinters, leftover intended sharp edges, leftover packed sky, leftover desk-keys, leftover desk-pins. They do not show leftover burr — leftover displaced material that still stands as a raised ragged lip along a finished cut, leftover raised ragged lip sitting immediately along a fixed cut edge, not Nib leftover corner, not Fuzz leftover fibre, not Tearout leftover splinter.

## Users

- people who already know a through-cut can still leave leftover displaced material standing as a raised lip
- anyone who refuses to treat a corner nib, a field of fuzz, a single splinter, a decorative arris, a packed sky, or a clock as this leftover
- desks that want burr as a sketch, not a mill sign-off, and not filing advice
- teams that want a no-backend, local-only pass — not Nib, not Fuzz, not Tearout, not a paste well

## Workflow

1. Load the seed: 4 mm of leftover burr — already showing, not a filed-only cut
2. Read the scene: one workpiece, one fixed through-cut, a leftover whose leftover is the burr, leftover labelled as a sketch
3. Move leftover burr (or use the arrow keys on the focused slider); leftover names showing or filed
4. Drop the leftover toward 0 mm and the cut looks filed / no leftover burr; raise it and a taller, more ragged raised lip still sits immediately along a fixed cut edge
5. Reset restores the seeded leftover showing

## Data model

One workpiece with leftover burr as leftover displaced material that still stands as a raised ragged lip along a finished cut:

- `burr` — millimetres of leftover standing lip height (default 4)

Derived picture:

- leftover labelled as a sketch (filed / showing), not a mill sign-off
- leftover burr labelled as a sketch
- filed / no leftover burr when burr ≤ 1 mm (integer slider means 0 or 1)

Nothing is persisted. Refresh restores the seeded scene.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: one workpiece with one fixed through-cut — a leftover whose leftover is the burr; leftover is leftover raised ragged lip sitting immediately along the cut edge (not a corner nib, not a field of fuzz, not a single splinter, not a decorative arris)
- moving a control redraws the leftover immediately; the through-cut does not move
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- leftover raised ragged lip sitting immediately along a fixed cut edge, not a corner as the hero, not a fibre field as the hero, not a splinter as the hero, not a clock
- seeded demo already shows a visible leftover (not a filed-only cut)
- live leftover burr, leftover labelled as a sketch (filed / showing)
- keyboard moves the focused control
- SVG text alternative names whether the burr is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/burr/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (one workpiece / leftover raised ragged lip along a fixed through-cut) is in the DOM
- seeded leftover is visible (showing — not filed)
- changing a control redraws and updates the readout; the through-cut stays fixed
- empty state is named filed — not “burr”
- no paste-well hero, no nib as the hero, no fuzz as the hero, no tearout as the hero, no clock face
