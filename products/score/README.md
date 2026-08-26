# Score

The cut is done, but a score still sits. Move the leftover score. See the residual knife groove still sitting in a fixed face after the cut.

This is not Witness. Witness is leftover pencil or ink layout line past the cut. This is not Kerf. Kerf is the saw gap itself. This is not Nib. Nib is a corner after intersecting cuts. This is not Burn. Burn is scorch from the cut. This is not Chip. Chip is a discrete flake from the chisel. This is not Horn. Horn is leftover tenon length past the shoulder. This is not marking advice. This is not a mill sign-off. Score answers “how deep leftover marking-knife groove still sits in a fixed face after the cut.”

## Problem

The cut is done, but a score still sits:

- how much leftover sitting score still sits in a fixed face after the cut?
- is the leftover erased, or showing?
- when is the leftover score obvious — as a sketch, not a mill sign-off?

Existing tools in this catalogue measure leftover layout lines past a cut, leftover saw gaps, leftover corner nibs, leftover scorches, leftover chips, leftover tenon horns, leftover packed sky, leftover desk-keys, leftover desk-pins. They do not show leftover score — leftover marking-knife groove still sitting in a fixed face after the cut, not Witness leftover layout line, not Kerf leftover saw gap, not Nib leftover corner.

## Users

- people who already know a cut can still leave one leftover score sitting in the face from the marking knife
- anyone who refuses to treat a pencil layout line, a saw kerf gap, a corner nib, a burn scorch, a sitting chip, a leftover horn, a packed sky, or a clock as this leftover
- desks that want score as a sketch, not a mill sign-off, and not marking advice
- teams that want a no-backend, local-only pass — not Witness, not Kerf, not Nib, not a paste well

## Workflow

1. Load the seed: 2 mm of leftover score — already showing, not an erased-only face
2. Read the scene: one workpiece, one fixed face and finished cut, a leftover whose leftover is one leftover knife groove sitting in that face, leftover labelled as a sketch
3. Move leftover score (or use the arrow keys on the focused slider); leftover names showing or erased
4. Drop the leftover toward 0 mm and the face looks erased / no leftover score; raise it and a deeper leftover score still sits in a fixed face
5. Reset restores the seeded leftover showing

## Data model

One workpiece with leftover score as leftover marking-knife groove that still sits in a fixed face after the cut:

- `score` — millimetres of leftover sitting score depth in a fixed face after the cut (default 2)

Derived picture:

- leftover labelled as a sketch (erased / showing), not a mill sign-off
- leftover score labelled as a sketch
- erased / no leftover score when score ≤ 1 mm (integer slider means 0 or 1)

Nothing is persisted. Refresh restores the seeded scene. Empty state is named erased — not “score”.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: one workpiece with a fixed face and finished cut and one leftover marking-knife groove sitting in that face (not a pencil layout line, not a saw kerf gap, not a corner nib)
- moving a control redraws the leftover immediately; the face and cut do not move
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- leftover knife groove sitting in a fixed face after the cut, not a layout line as the hero, not a kerf as the hero, not a corner nib as the hero, not a burn as the hero, not a sitting flake as the hero, not a clock
- seeded demo already shows a visible leftover (not an erased-only face)
- live leftover score, leftover labelled as a sketch (erased / showing)
- keyboard moves the focused control
- SVG text alternative names whether the score is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/score/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (one workpiece / leftover knife groove sitting in a fixed face after the cut) is in the DOM
- seeded leftover is visible (showing — not erased)
- changing a control redraws and updates the readout; the face and cut stay fixed
- empty state is named erased — not “score”
- no paste-well hero, no witness line as the hero, no kerf as the hero, no nib as the hero, no clock face
