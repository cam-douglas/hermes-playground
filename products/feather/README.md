# Feather

The blend is done, but a feather still sits. Move the leftover feather. See the residual feather edge still sitting on a fixed blended face.

This is not a holiday. Holiday is leftover residual bare miss still sitting after a brush coat. This is not a smear. Smear is leftover residual wipe streak still sitting on a face after a wipe. This is not a glaze. Glaze is leftover residual thick glaze still sitting on a wiped face. This is not a bloom. Bloom is leftover residual cloudy haze still sitting on a polished face. This is not a horn. This is not a clock. This is not mill advice. This is not a mill sign-off. Feather answers “how much leftover feather still sits on a fixed blended face after the blend.”

## Problem

The blend is done, but a feather still sits:

- how much leftover sitting feather still sits on the blended face?
- is the leftover blended, or showing?
- when is the leftover feather obvious — as a sketch, not a mill sign-off?

Existing tools in this catalogue measure leftover spring, leftover flake, leftover glaze, leftover swell, leftover sliver, leftover kink, leftover flash, leftover pinhole, leftover craze, leftover bloom, leftover relish, leftover smear, leftover gap, leftover shaving, leftover holiday, leftover stub, leftover creep, leftover packed sky, leftover desk-keys, leftover desk-pins. They do not show leftover feather — leftover residual feather edge still sitting on a fixed blended face, not a bare holiday miss, not a smear wipe streak, not a thick glaze pool, not a cloudy bloom haze.

## Users

- people who already know a blend can still leave leftover feather sitting as residual feather edge on a fixed blended face after the blend
- anyone who refuses to treat a holiday, a smear, a glaze, a bloom, a packed sky, or a clock as this leftover
- desks that want feather as a sketch, not a mill sign-off, and not mill advice
- teams that want a no-backend, local-only pass — not a holiday, not a smear, not a glaze, not a bloom, not a paste well

## Workflow

1. Load the seed: 2 mm of leftover feather — already showing, not a blended-only face
2. Read the scene: one workpiece, one blend that is already done, a leftover whose leftover is one leftover residual feather edge still sitting on that fixed blended face, leftover labelled as a sketch
3. Move leftover feather (or use the arrow keys on the focused slider); leftover names showing or blended
4. Drop the leftover toward 0 mm and the face looks blended / no leftover feather; raise it and a larger leftover feather still sits on a fixed blended face
5. Reset restores the seeded leftover showing

## Data model

One workpiece with leftover feather as leftover residual feather edge that still sits on a fixed blended face:

- `feather` — millimetres of leftover sitting feather length on the blended face (default 2)

Derived picture:

- leftover labelled as a sketch (blended / showing), not a mill sign-off
- leftover feather labelled as a sketch
- blended / no leftover feather when feather ≤ 0 mm (integer slider means 0)

Nothing is persisted. Refresh restores the seeded scene. Empty state is named blended — not “feather”.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: one workpiece with a blend that is already done and one leftover residual feather edge still sitting on that fixed blended face (not a bare holiday miss, not a smear wipe streak, not a thick glaze pool, not a cloudy bloom haze)
- moving a control redraws the leftover immediately; the blended face’s true plane does not move
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- leftover residual feather edge still sitting on a fixed blended face, not a holiday as the hero, not a smear as the hero, not a glaze as the hero, not a bloom as the hero, not a clock
- seeded demo already shows a visible leftover (not a blended-only face)
- live leftover feather, leftover labelled as a sketch (blended / showing)
- keyboard moves the focused control
- SVG text alternative names whether the feather is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/feather/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (one workpiece / leftover residual feather edge still sitting on a fixed blended face) is in the DOM
- seeded leftover is visible (showing — not blended)
- changing a control redraws and updates the readout; the face’s true plane stays fixed
- empty state is named blended — not “feather”
- no paste-well hero, no holiday as the hero, no smear as the hero, no glaze as the hero, no bloom as the hero, no clock face
