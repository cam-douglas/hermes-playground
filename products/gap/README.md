# Gap

The joint is closed, but a gap still sits. Move the leftover gap. See the residual open gap still sitting along a fixed joint after assembly.

This is not Proud. Proud is a high strip standing above the surrounding face. This is not Stub. Stub is a short remnant after a cut. This is not Nick. Nick is a V-shaped bite in a cut edge. This is not Holiday. Holiday is a missed bare patch after a brush coat. This is not a clock. This is not joinery advice. This is not a mill sign-off. Gap answers “how much leftover gap still sits along a fixed joint after assembly.”

## Problem

The joint is closed, but a gap still sits:

- how much leftover sitting gap still sits along the joint after assembly?
- is the leftover closed, or showing?
- when is the leftover gap obvious — as a sketch, not a mill sign-off?

Existing tools in this catalogue measure leftover shaving, leftover holiday, leftover stub, leftover creep, leftover nick, leftover packed sky, leftover desk-keys, leftover desk-pins. They do not show leftover gap — leftover residual open gap still sitting along a fixed joint after assembly, not Proud leftover high, not Stub leftover remnant, not Nick leftover V-bite, not Holiday leftover finish miss.

## Users

- people who already know a closed joint can still leave one leftover gap sitting along the seam as a residual opening
- anyone who refuses to treat a proud high strip, a stub remnant, a nick V-bite, a holiday, a packed sky, or a clock as this leftover
- desks that want gap as a sketch, not a mill sign-off, and not joinery advice
- teams that want a no-backend, local-only pass — not Proud, not Stub, not Nick, not Holiday, not a paste well

## Workflow

1. Load the seed: 2 mm of leftover gap — already showing, not a closed-only joint
2. Read the scene: one workpiece, one joint that is already closed, a leftover whose leftover is one leftover residual open gap still sitting along that joint after assembly, leftover labelled as a sketch
3. Move leftover gap (or use the arrow keys on the focused slider); leftover names showing or closed
4. Drop the leftover toward 0 mm and the joint looks closed / no leftover gap; raise it and a larger leftover gap opening still sits along a fixed joint after assembly
5. Reset restores the seeded leftover showing

## Data model

One workpiece with leftover gap as leftover residual opening that still sits along a fixed joint after assembly:

- `gap` — millimetres of leftover sitting gap opening after assembly (default 2)

Derived picture:

- leftover labelled as a sketch (closed / showing), not a mill sign-off
- leftover gap labelled as a sketch
- closed / no leftover gap when gap ≤ 1 mm (integer slider means 0 or 1)

Nothing is persisted. Refresh restores the seeded scene. Empty state is named closed — not “gap”.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: one workpiece with a joint that is already closed and one leftover residual open gap still sitting along that joint after assembly (not a proud high strip, not a stub remnant, not a nick V-bite, not a holiday)
- moving a control redraws the leftover immediately; the joint does not move
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- leftover residual open gap still sitting along a fixed joint after assembly, not a proud high as the hero, not a stub as the hero, not a nick as the hero, not a holiday as the hero, not a clock
- seeded demo already shows a visible leftover (not a closed-only joint)
- live leftover gap, leftover labelled as a sketch (closed / showing)
- keyboard moves the focused control
- SVG text alternative names whether the gap is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/gap/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (one workpiece / leftover residual open gap still sitting along a fixed joint after assembly) is in the DOM
- seeded leftover is visible (showing — not closed)
- changing a control redraws and updates the readout; the joint stays fixed
- empty state is named closed — not “gap”
- no paste-well hero, no proud as the hero, no stub as the hero, no nick as the hero, no holiday as the hero, no clock face
