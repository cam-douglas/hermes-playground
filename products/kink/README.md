# Kink

The straighten is done, but a kink still sits. Move the leftover kink. See the residual local kink still sitting in a fixed board edge.

This is not a warp. Warp is leftover residual full-length bow still sitting along the board. This is not spring. Spring is leftover residual spring-back still sitting after a straighten. This is not Lift. Lift is leftover residual veneer still sitting off the substrate. This is not a clock. This is not straighten advice. This is not a mill sign-off. Kink answers “how much leftover kink still sits in a fixed board edge.”

## Problem

The straighten is done, but a kink still sits:

- how much leftover sitting kink still sits in the board edge?
- is the leftover straight, or showing?
- when is the leftover kink obvious — as a sketch, not a mill sign-off?

Existing tools in this catalogue measure leftover flash, leftover pinhole, leftover craze, leftover bloom, leftover relish, leftover smear, leftover gap, leftover shaving, leftover holiday, leftover packed sky, leftover desk-keys, leftover desk-pins. They do not show leftover kink — leftover residual local kink still sitting in a fixed board edge, not a full-length warp bow, not spring-back, not Lift leftover veneer rise.

## Users

- people who already know a straightened board can still leave leftover kink sitting as a residual local bend in a fixed edge after the straighten
- anyone who refuses to treat a warp bow, spring-back, a lift, a packed sky, or a clock as this leftover
- desks that want kink as a sketch, not a mill sign-off, and not straighten advice
- teams that want a no-backend, local-only pass — not a warp, not spring, not Lift, not a paste well

## Workflow

1. Load the seed: 3 mm of leftover kink — already showing, not a straight-only edge
2. Read the scene: one workpiece, one straighten that is already done, a leftover whose leftover is one leftover residual local kink still sitting in that fixed board edge, leftover labelled as a sketch
3. Move leftover kink (or use the arrow keys on the focused slider); leftover names showing or straight
4. Drop the leftover toward 0 mm and the edge looks straight / no leftover kink; raise it and a larger leftover kink still sits in a fixed board edge
5. Reset restores the seeded leftover showing

## Data model

One workpiece with leftover kink as leftover residual local kink that still sits in a fixed board edge:

- `kink` — millimetres of leftover sitting kink offset in the board edge (default 3)

Derived picture:

- leftover labelled as a sketch (straight / showing), not a mill sign-off
- leftover kink labelled as a sketch
- straight / no leftover kink when kink ≤ 0 mm (integer slider means 0)

Nothing is persisted. Refresh restores the seeded scene. Empty state is named straight — not “kink”.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: one workpiece with a straighten that is already done and one leftover residual local kink still sitting in that fixed board edge (not a full-length warp bow, not spring-back, not a veneer lift)
- moving a control redraws the leftover immediately; the board edge’s true line does not move
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- leftover residual local kink still sitting in a fixed board edge, not a warp as the hero, not spring as the hero, not lift as the hero, not a clock
- seeded demo already shows a visible leftover (not a straight-only edge)
- live leftover kink, leftover labelled as a sketch (straight / showing)
- keyboard moves the focused control
- SVG text alternative names whether the kink is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/kink/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (one workpiece / leftover residual local kink still sitting in a fixed board edge) is in the DOM
- seeded leftover is visible (showing — not straight)
- changing a control redraws and updates the readout; the board’s true edge stays fixed
- empty state is named straight — not “kink”
- no paste-well hero, no warp as the hero, no spring as the hero, no lift as the hero, no clock face
