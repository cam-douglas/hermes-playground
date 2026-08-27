# Craze

The coat is on, but a craze still sits. Move the leftover craze. See the residual fine craze network still sitting on a fixed coated face.

This is not Bloom. Bloom is leftover residual cloudy bloom still sitting on a fixed polished face. This is not Holiday. Holiday is leftover missed bare patch still sitting after a brush coat. This is not Check. Check is leftover split still opening along the wood face. This is not a clock. This is not finish advice. This is not a mill sign-off. Craze answers “how much leftover craze still sits on a fixed coated face.”

## Problem

The coat is on, but a craze still sits:

- how much leftover sitting craze still sits on the coated face?
- is the leftover sound, or showing?
- when is the leftover craze obvious — as a sketch, not a mill sign-off?

Existing tools in this catalogue measure leftover bloom, leftover relish, leftover smear, leftover gap, leftover shaving, leftover holiday, leftover check, leftover packed sky, leftover desk-keys, leftover desk-pins. They do not show leftover craze — leftover residual fine craze network still sitting on a fixed coated face, not Bloom leftover cloudy haze, not Holiday leftover missed bare patch, not Check leftover wood split.

## Users

- people who already know a coated face can still leave leftover craze sitting as a residual fine crack network after the coat
- anyone who refuses to treat a cloudy bloom haze, a bare holiday, a wood check split, a packed sky, or a clock as this leftover
- desks that want craze as a sketch, not a mill sign-off, and not finish advice
- teams that want a no-backend, local-only pass — not Bloom, not Holiday, not Check, not a paste well

## Workflow

1. Load the seed: 2 mm of leftover craze — already showing, not a sound-only face
2. Read the scene: one workpiece, one coat that is already on, a leftover whose leftover is one leftover residual fine craze network still sitting on that fixed coated face, leftover labelled as a sketch
3. Move leftover craze (or use the arrow keys on the focused slider); leftover names showing or sound
4. Drop the leftover toward 0 mm and the face looks sound / no leftover craze; raise it and a larger leftover craze still sits on a fixed coated face
5. Reset restores the seeded leftover showing

## Data model

One workpiece with leftover craze as leftover residual fine craze network that still sits on a fixed coated face:

- `craze` — millimetres of leftover sitting network extent on the coated face (default 2)

Derived picture:

- leftover labelled as a sketch (sound / showing), not a mill sign-off
- leftover craze labelled as a sketch
- sound / no leftover craze when craze ≤ 1 mm (integer slider means 0 or 1)

Nothing is persisted. Refresh restores the seeded scene. Empty state is named sound — not “craze”.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: one workpiece with a coat that is already on and one leftover residual fine craze network still sitting on that fixed coated face (not a cloudy bloom haze, not a bare holiday, not a wood check split)
- moving a control redraws the leftover immediately; the coated face does not move
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- leftover residual fine craze network still sitting on a fixed coated face, not a bloom as the hero, not a holiday as the hero, not a check as the hero, not a clock
- seeded demo already shows a visible leftover (not a sound-only face)
- live leftover craze, leftover labelled as a sketch (sound / showing)
- keyboard moves the focused control
- SVG text alternative names whether the craze is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/craze/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (one workpiece / leftover residual fine craze network still sitting on a fixed coated face) is in the DOM
- seeded leftover is visible (showing — not sound)
- changing a control redraws and updates the readout; the coated face stays fixed
- empty state is named sound — not “craze”
- no paste-well hero, no bloom as the hero, no holiday as the hero, no check as the hero, no clock face
