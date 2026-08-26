# Proud

The joint is closed, but a strip still sits proud of the face. Move the leftover high. See the residual proud still standing above the surrounding face after a glue-up.

This is not Squeeze. Squeeze is leftover glue bead hugging a seam. This is not Bead. Bead is leftover round moulding. This is not Nib. Nib is leftover compact projection at an inside corner. This is not Burr. Burr is leftover ragged lip along a cut. This is not Inlay. Inlay is the inlay itself. This is not Plug. Plug is leftover filler in a hole. This is not Bruise. Bruise is leftover compressed depression. This is not planing advice. This is not a mill sign-off. Proud answers “how much leftover material still sits proud of a surrounding face.”

## Problem

The joint is closed, but a strip still sits proud of the face:

- how much leftover material still stands above the surrounding face after a glue-up or joint?
- is the leftover planed, or showing?
- when is the leftover proud obvious — as a sketch, not a mill sign-off?

Existing tools in this catalogue measure leftover glue beads, leftover round moulding, leftover corner nibs, leftover ragged lips, leftover inlays, leftover plugs, leftover compressed depressions, leftover packed sky, leftover desk-keys, leftover desk-pins. They do not show leftover proud — leftover material that still stands above the surrounding face after a glue-up or joint, leftover high strip/patch sitting above a fixed surrounding face, not Squeeze leftover glue, not Bead leftover round, not Nib leftover corner, not Burr leftover lip.

## Users

- people who already know a closed glue-up can still leave leftover material standing proud of the surrounding face
- anyone who refuses to treat a glue bead, a decorative bead, a corner nib, a ragged burr, a bruise depression, a packed sky, or a clock as this leftover
- desks that want proud as a sketch, not a mill sign-off, and not planing advice
- teams that want a no-backend, local-only pass — not Squeeze, not Bead, not Nib, not Burr, not a paste well

## Workflow

1. Load the seed: 5 mm of leftover proud — already showing, not a planed-only face
2. Read the scene: one workpiece, one fixed surrounding face, a leftover whose leftover is the proud, leftover labelled as a sketch
3. Move leftover proud (or use the arrow keys on the focused slider); leftover names showing or planed
4. Drop the leftover toward 0 mm and the face looks planed / no leftover proud; raise it and a taller leftover strip/patch still sits proud of a fixed surrounding face
5. Reset restores the seeded leftover showing

## Data model

One workpiece with leftover proud as leftover material that still stands above the surrounding face after a glue-up or joint:

- `proud` — millimetres of leftover height above the face (default 5)

Derived picture:

- leftover labelled as a sketch (planed / showing), not a mill sign-off
- leftover proud labelled as a sketch
- planed / no leftover proud when proud ≤ 1 mm (integer slider means 0 or 1)

Nothing is persisted. Refresh restores the seeded scene. Empty state is named planed — not “proud”, and not “flush” (Nib already uses flush).

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: one workpiece with a fixed surrounding face — a leftover whose leftover is the proud; leftover is leftover high strip/patch sitting above the face (not a glue bead, not a decorative bead, not a corner nib, not a ragged burr, not a bruise depression)
- moving a control redraws the leftover immediately; the surrounding face does not move
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- leftover high strip/patch sitting proud of a fixed surrounding face, not a glue bead as the hero, not a moulding as the hero, not a corner as the hero, not a ragged lip as the hero, not a depression as the hero, not a clock
- seeded demo already shows a visible leftover (not a planed-only face)
- live leftover proud, leftover labelled as a sketch (planed / showing)
- keyboard moves the focused control
- SVG text alternative names whether the proud is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/proud/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (one workpiece / leftover high strip above a fixed surrounding face) is in the DOM
- seeded leftover is visible (showing — not planed)
- changing a control redraws and updates the readout; the surrounding face stays fixed
- empty state is named planed — not “proud”
- no paste-well hero, no squeeze as the hero, no bead as the hero, no nib as the hero, no burr as the hero, no bruise as the hero, no clock face
