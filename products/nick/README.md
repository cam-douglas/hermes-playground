# Nick

The edge is cut, but a nick still sits. Move the leftover nick. See the residual V-shaped bite still sitting in a fixed cut edge after the cut.

This is not Nib. Nib is a compact leftover corner after intersecting cuts. This is not Burr. Burr is a ragged displaced lip along a cut. This is not Chip. Chip is a discrete flake from the chisel. This is not Score. Score is a marking-knife groove in the face. This is not Tearout. Tearout is a splinter torn at the cut. This is not cutting advice. This is not a mill sign-off. Nick answers “how deep leftover V-shaped bite still sits in a fixed cut edge after the cut.”

## Problem

The edge is cut, but a nick still sits:

- how much leftover sitting nick still sits in a fixed cut edge after the cut?
- is the leftover clean, or showing?
- when is the leftover nick obvious — as a sketch, not a mill sign-off?

Existing tools in this catalogue measure leftover corner nibs, leftover burr lips, leftover chips, leftover knife scores in a face, leftover tearout splinters, leftover packed sky, leftover desk-keys, leftover desk-pins. They do not show leftover nick — leftover V-shaped bite still sitting in a fixed cut edge after the cut, not Nib leftover corner, not Burr leftover lip, not Chip leftover flake, not Score leftover face groove.

## Users

- people who already know a cut can still leave one leftover nick sitting in the edge as a small V bite
- anyone who refuses to treat a corner nib, a burr lip, a sitting chip, a knife score in the face, a tearout splinter, a packed sky, or a clock as this leftover
- desks that want nick as a sketch, not a mill sign-off, and not cutting advice
- teams that want a no-backend, local-only pass — not Nib, not Burr, not Score, not a paste well

## Workflow

1. Load the seed: 3 mm of leftover nick — already showing, not a clean-only edge
2. Read the scene: one workpiece, one fixed cut edge, a leftover whose leftover is one leftover V bite sitting in that edge, leftover labelled as a sketch
3. Move leftover nick (or use the arrow keys on the focused slider); leftover names showing or clean
4. Drop the leftover toward 0 mm and the edge looks clean / no leftover nick; raise it and a deeper leftover nick still sits in a fixed edge
5. Reset restores the seeded leftover showing

## Data model

One workpiece with leftover nick as leftover V-shaped bite that still sits in a fixed cut edge after the cut:

- `nick` — millimetres of leftover sitting nick depth in a fixed cut edge after the cut (default 3)

Derived picture:

- leftover labelled as a sketch (clean / showing), not a mill sign-off
- leftover nick labelled as a sketch
- clean / no leftover nick when nick ≤ 1 mm (integer slider means 0 or 1)

Nothing is persisted. Refresh restores the seeded scene. Empty state is named clean — not “nick”.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: one workpiece with a fixed cut edge and one leftover V-shaped bite sitting in that edge (not a corner nib, not a burr lip, not a chip flake, not a face groove)
- moving a control redraws the leftover immediately; the edge and cut do not move
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- leftover V bite sitting in a fixed cut edge after the cut, not a corner nib as the hero, not a burr as the hero, not a sitting flake as the hero, not a face groove as the hero, not a clock
- seeded demo already shows a visible leftover (not a clean-only edge)
- live leftover nick, leftover labelled as a sketch (clean / showing)
- keyboard moves the focused control
- SVG text alternative names whether the nick is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/nick/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (one workpiece / leftover V bite sitting in a fixed cut edge after the cut) is in the DOM
- seeded leftover is visible (showing — not clean)
- changing a control redraws and updates the readout; the edge and cut stay fixed
- empty state is named clean — not “nick”
- no paste-well hero, no nib as the hero, no burr as the hero, no chip as the hero, no score as the hero, no clock face
