# Pinhole

The coat is on, but a pinhole still sits. Move the leftover pinhole. See the residual tiny pinhole still sitting on a fixed coated face.

This is not Craze. Craze is leftover residual fine craze network still sitting on a fixed coated face. This is not Bloom. Bloom is leftover residual cloudy bloom still sitting on a fixed polished face. This is not Holiday. Holiday is leftover missed bare patch still sitting after a brush coat. This is not Burr. Burr is leftover raised lip still standing along a finished cut. This is not a clock. This is not finish advice. This is not a mill sign-off. Pinhole answers “how much leftover pinhole still sits on a fixed coated face.”

## Problem

The coat is on, but a pinhole still sits:

- how much leftover sitting pinhole still sits on the coated face?
- is the leftover sealed, or showing?
- when is the leftover pinhole obvious — as a sketch, not a mill sign-off?

Existing tools in this catalogue measure leftover craze, leftover bloom, leftover relish, leftover smear, leftover gap, leftover shaving, leftover holiday, leftover packed sky, leftover desk-keys, leftover desk-pins. They do not show leftover pinhole — leftover residual tiny round pinhole still sitting on a fixed coated face, not Craze leftover fine crack network, not Bloom leftover cloudy haze, not Holiday leftover missed bare patch, not Burr leftover standing lip.

## Users

- people who already know a coated face can still leave leftover pinhole sitting as a residual tiny round hole after the coat
- anyone who refuses to treat a craze network, a cloudy bloom haze, a bare holiday, a burr, a packed sky, or a clock as this leftover
- desks that want pinhole as a sketch, not a mill sign-off, and not finish advice
- teams that want a no-backend, local-only pass — not Craze, not Bloom, not Holiday, not Burr, not a paste well

## Workflow

1. Load the seed: 1 mm of leftover pinhole — already showing, not a sealed-only face
2. Read the scene: one workpiece, one coat that is already on, a leftover whose leftover is one leftover residual tiny round pinhole still sitting on that fixed coated face, leftover labelled as a sketch
3. Move leftover pinhole (or use the arrow keys on the focused slider); leftover names showing or sealed
4. Drop the leftover toward 0 mm and the face looks sealed / no leftover pinhole; raise it and a larger leftover pinhole still sits on a fixed coated face
5. Reset restores the seeded leftover showing

## Data model

One workpiece with leftover pinhole as leftover residual tiny round pinhole that still sits on a fixed coated face:

- `pinhole` — millimetres of leftover sitting pinhole diameter on the coated face (default 1)

Derived picture:

- leftover labelled as a sketch (sealed / showing), not a mill sign-off
- leftover pinhole labelled as a sketch
- sealed / no leftover pinhole when pinhole ≤ 0 mm (integer slider means 0)

Nothing is persisted. Refresh restores the seeded scene. Empty state is named sealed — not “pinhole”.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: one workpiece with a coat that is already on and one leftover residual tiny round pinhole still sitting on that fixed coated face (not a fine craze network, not a cloudy bloom haze, not a bare holiday)
- moving a control redraws the leftover immediately; the coated face does not move
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- leftover residual tiny round pinhole still sitting on a fixed coated face, not a craze as the hero, not a bloom as the hero, not a holiday as the hero, not a burr as the hero, not a clock
- seeded demo already shows a visible leftover (not a sealed-only face)
- live leftover pinhole, leftover labelled as a sketch (sealed / showing)
- keyboard moves the focused control
- SVG text alternative names whether the pinhole is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/pinhole/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (one workpiece / leftover residual tiny round pinhole still sitting on a fixed coated face) is in the DOM
- seeded leftover is visible (showing — not sealed)
- changing a control redraws and updates the readout; the coated face stays fixed
- empty state is named sealed — not “pinhole”
- no paste-well hero, no craze as the hero, no bloom as the hero, no holiday as the hero, no burr as the hero, no clock face
