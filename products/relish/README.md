# Relish

The shoulder is cut, but the relish still sits. Move the leftover relish. See the residual excess length still sitting on a fixed tenon beyond the shoulder.

This is not Horn. Horn is leftover length of tenon still sitting past a fixed intended shoulder as a protruding horn. This is not Stub. Stub is a short remnant still sitting after a cut. This is not Gap. Gap is a residual open gap still sitting along a fixed joint after assembly. This is not a clock. This is not joinery advice. This is not a mill sign-off. Relish answers “how much leftover relish still sits on a fixed tenon beyond the shoulder.”

## Problem

The shoulder is cut, but the relish still sits:

- how much leftover sitting relish still sits on the tenon beyond the shoulder?
- is the leftover trimmed, or showing?
- when is the leftover relish obvious — as a sketch, not a mill sign-off?

Existing tools in this catalogue measure leftover smear, leftover gap, leftover shaving, leftover holiday, leftover stub, leftover horn, leftover packed sky, leftover desk-keys, leftover desk-pins. They do not show leftover relish — leftover residual excess length still sitting on a fixed tenon beyond the shoulder, not Horn leftover protruding horn, not Stub leftover cut remnant, not Gap leftover open joint.

## Users

- people who already know a cut shoulder can still leave leftover relish sitting on the tenon as residual excess length beyond that shoulder
- anyone who refuses to treat a protruding horn, a stub remnant, an open gap, a packed sky, or a clock as this leftover
- desks that want relish as a sketch, not a mill sign-off, and not joinery advice
- teams that want a no-backend, local-only pass — not Horn, not Stub, not Gap, not a paste well

## Workflow

1. Load the seed: 4 mm of leftover relish — already showing, not a trimmed-only tenon
2. Read the scene: one workpiece, one shoulder that is already cut, a leftover whose leftover is one leftover residual excess still sitting on that fixed tenon beyond the shoulder, leftover labelled as a sketch
3. Move leftover relish (or use the arrow keys on the focused slider); leftover names showing or trimmed
4. Drop the leftover toward 0 mm and the tenon looks trimmed / no leftover relish; raise it and a larger leftover relish still sits on a fixed tenon beyond the shoulder
5. Reset restores the seeded leftover showing

## Data model

One workpiece with leftover relish as leftover residual excess length that still sits on a fixed tenon beyond the shoulder:

- `relish` — millimetres of leftover sitting excess on the tenon beyond the shoulder (default 4)

Derived picture:

- leftover labelled as a sketch (trimmed / showing), not a mill sign-off
- leftover relish labelled as a sketch
- trimmed / no leftover relish when relish ≤ 1 mm (integer slider means 0 or 1)

Nothing is persisted. Refresh restores the seeded scene. Empty state is named trimmed — not “relish”.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: one workpiece with a shoulder that is already cut and one leftover residual excess still sitting on that fixed tenon beyond the shoulder (not a horn protrusion, not a stub remnant, not an open gap)
- moving a control redraws the leftover immediately; the tenon and the shoulder do not move
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- leftover residual excess still sitting on a fixed tenon beyond the shoulder, not a horn as the hero, not a stub as the hero, not a gap as the hero, not a clock
- seeded demo already shows a visible leftover (not a trimmed-only tenon)
- live leftover relish, leftover labelled as a sketch (trimmed / showing)
- keyboard moves the focused control
- SVG text alternative names whether the relish is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/relish/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (one workpiece / leftover residual excess still sitting on a fixed tenon beyond the shoulder) is in the DOM
- seeded leftover is visible (showing — not trimmed)
- changing a control redraws and updates the readout; the tenon and the shoulder stay fixed
- empty state is named trimmed — not “relish”
- no paste-well hero, no horn as the hero, no stub as the hero, no gap as the hero, no clock face
