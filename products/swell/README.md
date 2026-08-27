# Swell

The dry is done, but a swell still sits. Move the leftover swell. See the residual local swell still sitting on a fixed board face.

This is not a warp. Warp is leftover residual full-length bow still sitting after the dry. This is not a cup. Cup is leftover residual dish still sitting across the width. This is not a bow. Bow is leftover residual length curve still sitting along the board. This is not a kink. Kink is leftover residual sharp local bend still sitting in an edge. This is not a whisker. This is not a clock. This is not mill advice. This is not a mill sign-off. Swell answers “how much leftover swell still sits on a fixed board face.”

## Problem

The dry is done, but a swell still sits:

- how much leftover sitting swell still sits on the board face?
- is the leftover flat, or showing?
- when is the leftover swell obvious — as a sketch, not a mill sign-off?

Existing tools in this catalogue measure leftover sliver, leftover kink, leftover flash, leftover pinhole, leftover craze, leftover bloom, leftover relish, leftover smear, leftover gap, leftover shaving, leftover holiday, leftover stub, leftover chip, leftover tearout, leftover packed sky, leftover desk-keys, leftover desk-pins. They do not show leftover swell — leftover residual local swell still sitting on a fixed board face, not a full-length warp, not a cup dish, not a bow, not a kink in an edge.

## Users

- people who already know a dry can still leave leftover swell sitting as a residual local raised moisture bump on a fixed board face after the dry
- anyone who refuses to treat a warp, a cup, a bow, a kink, a whisker, a packed sky, or a clock as this leftover
- desks that want swell as a sketch, not a mill sign-off, and not mill advice
- teams that want a no-backend, local-only pass — not a warp, not a cup, not a bow, not a kink, not a paste well

## Workflow

1. Load the seed: 2 mm of leftover swell — already showing, not a flat-only face
2. Read the scene: one workpiece, one dry that is already done, a leftover whose leftover is one leftover residual local swell still sitting on that fixed board face, leftover labelled as a sketch
3. Move leftover swell (or use the arrow keys on the focused slider); leftover names showing or flat
4. Drop the leftover toward 0 mm and the face looks flat / no leftover swell; raise it and a taller leftover swell still sits on a fixed board face
5. Reset restores the seeded leftover showing

## Data model

One workpiece with leftover swell as leftover residual local swell that still sits on a fixed board face:

- `swell` — millimetres of leftover sitting swell height on the board face (default 2)

Derived picture:

- leftover labelled as a sketch (flat / showing), not a mill sign-off
- leftover swell labelled as a sketch
- flat / no leftover swell when swell ≤ 0 mm (integer slider means 0)

Nothing is persisted. Refresh restores the seeded scene. Empty state is named flat — not “swell”.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: one workpiece with a dry that is already done and one leftover residual local swell still sitting on that fixed board face (not a full-length warp, not a cup dish, not a bow, not a kink in an edge)
- moving a control redraws the leftover immediately; the board face’s true plane does not move
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- leftover residual local swell still sitting on a fixed board face, not a warp as the hero, not a cup as the hero, not a bow as the hero, not a kink as the hero, not a clock
- seeded demo already shows a visible leftover (not a flat-only face)
- live leftover swell, leftover labelled as a sketch (flat / showing)
- keyboard moves the focused control
- SVG text alternative names whether the swell is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/swell/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (one workpiece / leftover residual local swell still sitting on a fixed board face) is in the DOM
- seeded leftover is visible (showing — not flat)
- changing a control redraws and updates the readout; the board’s true face stays fixed
- empty state is named flat — not “swell”
- no paste-well hero, no warp as the hero, no cup as the hero, no bow as the hero, no kink as the hero, no clock face
