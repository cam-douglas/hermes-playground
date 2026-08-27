# Bloom

The polish is on, but a bloom still sits. Move the leftover bloom. See the residual cloudy bloom still sitting on a fixed polished face.

This is not Holiday. Holiday is leftover missed bare patch still sitting after a brush coat. This is not Stain. Stain is leftover wash still sitting in the face. This is not Smear. Smear is leftover residual smear still sitting on a fixed face after a wipe. This is not Burn. Burn is leftover heat mark still sitting along the kerf. This is not a clock. This is not finish advice. This is not a mill sign-off. Bloom answers “how much leftover bloom still sits on a fixed polished face.”

## Problem

The polish is on, but a bloom still sits:

- how much leftover sitting bloom still sits on the polished face?
- is the leftover polished, or showing?
- when is the leftover bloom obvious — as a sketch, not a mill sign-off?

Existing tools in this catalogue measure leftover relish, leftover smear, leftover gap, leftover shaving, leftover holiday, leftover stain, leftover burn, leftover packed sky, leftover desk-keys, leftover desk-pins. They do not show leftover bloom — leftover residual cloudy bloom still sitting on a fixed polished face, not Holiday leftover missed bare patch, not Stain leftover wash, not Smear leftover streak, not Burn leftover scorch.

## Users

- people who already know a polished face can still leave leftover bloom sitting as residual cloudy haze after the polish
- anyone who refuses to treat a bare holiday, a stain wash, a smear streak, a burn scorch, a packed sky, or a clock as this leftover
- desks that want bloom as a sketch, not a mill sign-off, and not finish advice
- teams that want a no-backend, local-only pass — not Holiday, not Stain, not Smear, not Burn, not a paste well

## Workflow

1. Load the seed: 3 mm of leftover bloom — already showing, not a polished-only face
2. Read the scene: one workpiece, one polish that is already on, a leftover whose leftover is one leftover residual cloudy bloom still sitting on that fixed polished face, leftover labelled as a sketch
3. Move leftover bloom (or use the arrow keys on the focused slider); leftover names showing or polished
4. Drop the leftover toward 0 mm and the face looks polished / no leftover bloom; raise it and a larger leftover bloom still sits on a fixed polished face
5. Reset restores the seeded leftover showing

## Data model

One workpiece with leftover bloom as leftover residual cloudy bloom that still sits on a fixed polished face:

- `bloom` — millimetres of leftover sitting haze extent on the polished face (default 3)

Derived picture:

- leftover labelled as a sketch (polished / showing), not a mill sign-off
- leftover bloom labelled as a sketch
- polished / no leftover bloom when bloom ≤ 1 mm (integer slider means 0 or 1)

Nothing is persisted. Refresh restores the seeded scene. Empty state is named polished — not “bloom”.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: one workpiece with a polish that is already on and one leftover residual cloudy bloom still sitting on that fixed polished face (not a bare holiday, not a stain wash, not a smear streak, not a burn scorch)
- moving a control redraws the leftover immediately; the polished face does not move
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- leftover residual cloudy bloom still sitting on a fixed polished face, not a holiday as the hero, not a stain as the hero, not a smear as the hero, not a burn as the hero, not a clock
- seeded demo already shows a visible leftover (not a polished-only face)
- live leftover bloom, leftover labelled as a sketch (polished / showing)
- keyboard moves the focused control
- SVG text alternative names whether the bloom is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/bloom/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (one workpiece / leftover residual cloudy bloom still sitting on a fixed polished face) is in the DOM
- seeded leftover is visible (showing — not polished)
- changing a control redraws and updates the readout; the polished face stays fixed
- empty state is named polished — not “bloom”
- no paste-well hero, no holiday as the hero, no stain as the hero, no smear as the hero, no burn as the hero, no clock face
