# Skip

The knives have passed, but a skip still sits. Move the leftover skip. See the residual low missed patch still sitting on a fixed planed face after the planer.

This is not Snipe. Snipe is a dip at the end of a pass. This is not Chatter. Chatter is a ripple from a vibrating tool. This is not Proud. Proud is a high leftover above the face after the joint. This is not Bruise. Bruise is compression after pressure. This is not Lift. Lift is veneer sitting off the face. This is not Chip. Chip is a discrete flake from the chisel. This is not planing advice. This is not a mill sign-off. Skip answers “how deep the leftover low missed patch still sits on a fixed planed face after the knives.”

## Problem

The knives have passed, but a skip still sits:

- how much leftover sitting skip still sits on a planed face after the planer?
- is the leftover taken, or showing?
- when is the leftover skip obvious — as a sketch, not a mill sign-off?

Existing tools in this catalogue measure leftover end-dips, leftover ripples, leftover highs, leftover compression, leftover lifted veneer, leftover chips, leftover packed sky, leftover desk-keys, leftover desk-pins. They do not show leftover skip — leftover low missed patch that still sits on a fixed planed face after the knives, not Snipe leftover end-dip, not Chatter leftover ripple, not Proud leftover high, not Bruise leftover compression, not Chip leftover flake.

## Users

- people who already know a planer pass can still leave one leftover skip sitting on the face
- anyone who refuses to treat an end dip, a washboard ripple, a high proud, a bruise, a lifted veneer, a sitting chip, a packed sky, or a clock as this leftover
- desks that want skip as a sketch, not a mill sign-off, and not planing advice
- teams that want a no-backend, local-only pass — not Snipe, not Chatter, not Proud, not a paste well

## Workflow

1. Load the seed: 3 mm of leftover skip — already showing, not a taken-only face
2. Read the scene: one workpiece, one fixed planed face, a leftover whose leftover is one low missed patch sitting on that face, leftover labelled as a sketch
3. Move leftover skip (or use the arrow keys on the focused slider); leftover names showing or taken
4. Drop the leftover toward 0 mm and the face looks taken / no leftover skip; raise it and a deeper leftover skip still sits on a fixed planed face
5. Reset restores the seeded leftover showing

## Data model

One workpiece with leftover skip as leftover low missed patch that still sits on a fixed planed face after the planer:

- `skip` — millimetres of leftover sitting skip depth on a fixed planed face (default 3)

Derived picture:

- leftover labelled as a sketch (taken / showing), not a mill sign-off
- leftover skip labelled as a sketch
- taken / no leftover skip when skip ≤ 1 mm (integer slider means 0 or 1)

Nothing is persisted. Refresh restores the seeded scene. Empty state is named taken — not “skip”.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: one workpiece with a fixed planed face and one leftover low missed patch sitting on that face (not an end dip, not a washboard ripple, not a high strip, not a sitting flake)
- moving a control redraws the leftover immediately; the face does not move
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- leftover low missed patch sitting on a fixed planed face after the planer, not an end dip as the hero, not ripples as the hero, not a high proud as the hero, not a bruise as the hero, not a sitting flake as the hero, not a clock
- seeded demo already shows a visible leftover (not a taken-only face)
- live leftover skip, leftover labelled as a sketch (taken / showing)
- keyboard moves the focused control
- SVG text alternative names whether the skip is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/skip/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (one workpiece / leftover skip sitting on a fixed planed face) is in the DOM
- seeded leftover is visible (showing — not taken)
- changing a control redraws and updates the readout; the face stays fixed
- empty state is named taken — not “skip”
- no paste-well hero, no snipe as the hero, no chatter as the hero, no proud as the hero, no chip as the hero, no clock face
