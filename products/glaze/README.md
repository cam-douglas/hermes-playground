# Glaze

The wipe is done, but a glaze still sits. Move the leftover glaze. See the residual thick glaze still sitting on a fixed wiped face.

This is not a smear. Smear is leftover residual wipe streak still sitting after the wipe. This is not a bloom. Bloom is leftover residual cloudy haze still sitting on a polished face. This is not a holiday. Holiday is leftover residual bare miss still sitting after a brush coat. This is not a craze. Craze is leftover residual crack network still sitting on a coated face. This is not flame. This is not a clock. This is not mill advice. This is not a mill sign-off. Glaze answers “how much leftover glaze still sits on a fixed wiped face.”

## Problem

The wipe is done, but a glaze still sits:

- how much leftover sitting glaze still sits on the wiped face?
- is the leftover wiped, or showing?
- when is the leftover glaze obvious — as a sketch, not a mill sign-off?

Existing tools in this catalogue measure leftover swell, leftover sliver, leftover kink, leftover flash, leftover pinhole, leftover craze, leftover bloom, leftover relish, leftover smear, leftover gap, leftover shaving, leftover holiday, leftover stub, leftover creep, leftover packed sky, leftover desk-keys, leftover desk-pins. They do not show leftover glaze — leftover residual thick glaze still sitting on a fixed wiped face, not a smear streak, not a cloudy bloom, not a bare holiday, not a craze network.

## Users

- people who already know a wipe can still leave leftover glaze sitting as a residual thick translucent glaze pool on a fixed wiped face after the wipe
- anyone who refuses to treat a smear, a bloom, a holiday, a craze, flame, a packed sky, or a clock as this leftover
- desks that want glaze as a sketch, not a mill sign-off, and not mill advice
- teams that want a no-backend, local-only pass — not a smear, not a bloom, not a holiday, not a craze, not a paste well

## Workflow

1. Load the seed: 2 mm of leftover glaze — already showing, not a wiped-only face
2. Read the scene: one workpiece, one wipe that is already done, a leftover whose leftover is one leftover residual thick glaze still sitting on that fixed wiped face, leftover labelled as a sketch
3. Move leftover glaze (or use the arrow keys on the focused slider); leftover names showing or wiped
4. Drop the leftover toward 0 mm and the face looks wiped / no leftover glaze; raise it and a thicker leftover glaze still sits on a fixed wiped face
5. Reset restores the seeded leftover showing

## Data model

One workpiece with leftover glaze as leftover residual thick glaze that still sits on a fixed wiped face:

- `glaze` — millimetres of leftover sitting glaze thickness / extent on the wiped face (default 2)

Derived picture:

- leftover labelled as a sketch (wiped / showing), not a mill sign-off
- leftover glaze labelled as a sketch
- wiped / no leftover glaze when glaze ≤ 0 mm (integer slider means 0)

Nothing is persisted. Refresh restores the seeded scene. Empty state is named wiped — not “glaze”.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: one workpiece with a wipe that is already done and one leftover residual thick glaze still sitting on that fixed wiped face (not a smear streak, not a cloudy bloom, not a bare holiday, not a craze network)
- moving a control redraws the leftover immediately; the wiped face’s true plane does not move
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- leftover residual thick glaze still sitting on a fixed wiped face, not a smear as the hero, not a bloom as the hero, not a holiday as the hero, not a craze as the hero, not a clock
- seeded demo already shows a visible leftover (not a wiped-only face)
- live leftover glaze, leftover labelled as a sketch (wiped / showing)
- keyboard moves the focused control
- SVG text alternative names whether the glaze is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/glaze/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (one workpiece / leftover residual thick glaze still sitting on a fixed wiped face) is in the DOM
- seeded leftover is visible (showing — not wiped)
- changing a control redraws and updates the readout; the face’s true plane stays fixed
- empty state is named wiped — not “glaze”
- no paste-well hero, no smear as the hero, no bloom as the hero, no holiday as the hero, no craze as the hero, no clock face
