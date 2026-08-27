# Flake

The sand is done, but a flake still sits. Move the leftover flake. See the residual surface flake still sitting on a fixed sanded face.

This is not dust. Dust is leftover residual loose sawdust still sitting in a kerf. This is not a chip. Chip is leftover residual chisel chip still sitting from the cut. This is not a sliver. Sliver is leftover residual thin cut fibre still sitting on a cut edge. This is not a shaving. Shaving is leftover residual plane curl still sitting after a plane pass. This is not a clock. This is not mill advice. This is not a mill sign-off. Flake answers “how much leftover flake still sits on a fixed sanded face.”

## Problem

The sand is done, but a flake still sits:

- how much leftover sitting flake still sits on the sanded face?
- is the leftover smooth, or showing?
- when is the leftover flake obvious — as a sketch, not a mill sign-off?

Existing tools in this catalogue measure leftover glaze, leftover swell, leftover sliver, leftover kink, leftover flash, leftover pinhole, leftover craze, leftover bloom, leftover relish, leftover smear, leftover gap, leftover shaving, leftover holiday, leftover stub, leftover creep, leftover packed sky, leftover desk-keys, leftover desk-pins. They do not show leftover flake — leftover residual surface flake still sitting on a fixed sanded face, not loose dust, not a chisel chip, not a cut sliver, not a plane shaving.

## Users

- people who already know a sand can still leave leftover flake sitting as a residual thin lifting flake of finish or fibre on a fixed sanded face after the sand
- anyone who refuses to treat dust, a chip, a sliver, a shaving, a packed sky, or a clock as this leftover
- desks that want flake as a sketch, not a mill sign-off, and not mill advice
- teams that want a no-backend, local-only pass — not dust, not a chip, not a sliver, not a shaving, not a paste well

## Workflow

1. Load the seed: 2 mm of leftover flake — already showing, not a smooth-only face
2. Read the scene: one workpiece, one sand that is already done, a leftover whose leftover is one leftover residual surface flake still sitting on that fixed sanded face, leftover labelled as a sketch
3. Move leftover flake (or use the arrow keys on the focused slider); leftover names showing or smooth
4. Drop the leftover toward 0 mm and the face looks smooth / no leftover flake; raise it and a larger leftover flake still sits on a fixed sanded face
5. Reset restores the seeded leftover showing

## Data model

One workpiece with leftover flake as leftover residual surface flake that still sits on a fixed sanded face:

- `flake` — millimetres of leftover sitting flake extent / lift on the sanded face (default 2)

Derived picture:

- leftover labelled as a sketch (smooth / showing), not a mill sign-off
- leftover flake labelled as a sketch
- smooth / no leftover flake when flake ≤ 0 mm (integer slider means 0)

Nothing is persisted. Refresh restores the seeded scene. Empty state is named smooth — not “flake”.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: one workpiece with a sand that is already done and one leftover residual surface flake still sitting on that fixed sanded face (not loose dust, not a chisel chip, not a cut sliver, not a plane shaving)
- moving a control redraws the leftover immediately; the sanded face’s true plane does not move
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- leftover residual surface flake still sitting on a fixed sanded face, not dust as the hero, not a chip as the hero, not a sliver as the hero, not a shaving as the hero, not a clock
- seeded demo already shows a visible leftover (not a smooth-only face)
- live leftover flake, leftover labelled as a sketch (smooth / showing)
- keyboard moves the focused control
- SVG text alternative names whether the flake is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/flake/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (one workpiece / leftover residual surface flake still sitting on a fixed sanded face) is in the DOM
- seeded leftover is visible (showing — not smooth)
- changing a control redraws and updates the readout; the face’s true plane stays fixed
- empty state is named smooth — not “flake”
- no paste-well hero, no dust as the hero, no chip as the hero, no sliver as the hero, no shaving as the hero, no clock face
