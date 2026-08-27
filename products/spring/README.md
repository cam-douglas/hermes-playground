# Spring

The clamp is off, but a spring still sits. Move the leftover spring. See the residual spring-back still sitting in a fixed clamped assembly.

This is not a kink. Kink is leftover residual local kink still sitting in a board edge. This is not a warp. Warp is leftover residual full-length bow still sitting along a board. This is not a swell. Swell is leftover residual local face moisture bump still sitting on a board face. This is not a skip. Skip is leftover residual planer miss still sitting after the planer. This is not a clock. This is not mill advice. This is not a mill sign-off. Spring answers “how much leftover spring still sits in a fixed clamped assembly after the clamp.”

## Problem

The clamp is off, but a spring still sits:

- how much leftover sitting spring still sits in the clamped assembly?
- is the leftover set, or showing?
- when is the leftover spring obvious — as a sketch, not a mill sign-off?

Existing tools in this catalogue measure leftover flake, leftover glaze, leftover swell, leftover sliver, leftover kink, leftover flash, leftover pinhole, leftover craze, leftover bloom, leftover relish, leftover smear, leftover gap, leftover shaving, leftover holiday, leftover stub, leftover creep, leftover packed sky, leftover desk-keys, leftover desk-pins. They do not show leftover spring — leftover residual spring-back still sitting in a fixed clamped assembly, not a sharp local edge bend, not a full-length bow, not a face moisture bump, not a planer miss.

## Users

- people who already know a clamp can still leave leftover spring sitting as residual spring-back in a fixed clamped assembly after the clamp
- anyone who refuses to treat a kink, a warp, a swell, a skip, a packed sky, or a clock as this leftover
- desks that want spring as a sketch, not a mill sign-off, and not mill advice
- teams that want a no-backend, local-only pass — not a kink, not a warp, not a swell, not a skip, not a paste well

## Workflow

1. Load the seed: 3 mm of leftover spring — already showing, not a set-only assembly
2. Read the scene: one workpiece, one clamp that is already off, a leftover whose leftover is one leftover residual spring-back still sitting in that fixed clamped assembly, leftover labelled as a sketch
3. Move leftover spring (or use the arrow keys on the focused slider); leftover names showing or set
4. Drop the leftover toward 0 mm and the assembly looks set / no leftover spring; raise it and a larger leftover spring still sits in a fixed clamped assembly
5. Reset restores the seeded leftover showing

## Data model

One workpiece with leftover spring as leftover residual spring-back that still sits in a fixed clamped assembly:

- `spring` — millimetres of leftover sitting spring gap in the clamped assembly (default 3)

Derived picture:

- leftover labelled as a sketch (set / showing), not a mill sign-off
- leftover spring labelled as a sketch
- set / no leftover spring when spring ≤ 0 mm (integer slider means 0)

Nothing is persisted. Refresh restores the seeded scene. Empty state is named set — not “spring”.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: one workpiece with a clamp that is already off and one leftover residual spring-back still sitting in that fixed clamped assembly (not a sharp local edge bend, not a full-length bow, not a face moisture bump, not a planer miss)
- moving a control redraws the leftover immediately; the clamped assembly’s true plane does not move
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- leftover residual spring-back still sitting in a fixed clamped assembly, not a kink as the hero, not a warp as the hero, not a swell as the hero, not a skip as the hero, not a clock
- seeded demo already shows a visible leftover (not a set-only assembly)
- live leftover spring, leftover labelled as a sketch (set / showing)
- keyboard moves the focused control
- SVG text alternative names whether the spring is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/spring/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (one workpiece / leftover residual spring-back still sitting in a fixed clamped assembly) is in the DOM
- seeded leftover is visible (showing — not set)
- changing a control redraws and updates the readout; the assembly’s true plane stays fixed
- empty state is named set — not “spring”
- no paste-well hero, no kink as the hero, no warp as the hero, no swell as the hero, no skip as the hero, no clock face
