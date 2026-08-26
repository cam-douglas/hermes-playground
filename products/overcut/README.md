# Overcut

The stop is there, but the saw still ran past it. Move the leftover overcut. See the residual extra run still sitting past a fixed intended stop.

This is not Snipe. Snipe is a planing dip at the end of a board. This is not Kerf. Kerf is the gap the blade removed. This is not Witness. Witness is a leftover layout line past a finished cut. This is not Tearout. Tearout is a splinter. This is not Chatter. Chatter is a ripple. This is not sawing advice. This is not a mill sign-off. Overcut answers “how far the leftover saw path still sits past a fixed stop.”

## Problem

The stop is there, but the saw still ran past it:

- how much leftover extra run still sits past the intended stop?
- is the leftover stopped, or showing?
- when is the leftover overcut obvious — as a sketch, not a mill sign-off?

Existing tools in this catalogue measure leftover planing dips, leftover blade gaps, leftover layout lines, leftover splinters, leftover ripples, leftover packed sky, leftover desk-keys, leftover desk-pins. They do not show leftover overcut — leftover extra run that still sits past a fixed intended stop, leftover saw path sitting past a stop mark, not Snipe leftover dip, not Kerf leftover gap width, not Witness leftover pencil, not Tearout leftover splinter.

## Users

- people who already know a cut can still leave leftover extra run sitting past a stop
- anyone who refuses to treat a snipe dip, a changing kerf width, a pencil witness line, a splinter, a ripple, a packed sky, or a clock as this leftover
- desks that want overcut as a sketch, not a mill sign-off, and not sawing advice
- teams that want a no-backend, local-only pass — not Snipe, not Kerf, not Witness, not a paste well

## Workflow

1. Load the seed: 8 mm of leftover overcut — already showing, not a stopped-only cut
2. Read the scene: one workpiece, one fixed intended stop, a leftover whose leftover is the extra run past that stop, leftover labelled as a sketch
3. Move leftover overcut (or use the arrow keys on the focused slider); leftover names showing or stopped
4. Drop the leftover toward 0 mm and the cut looks stopped / no leftover overcut; raise it and a longer leftover saw path still sits past a fixed stop
5. Reset restores the seeded leftover showing

## Data model

One workpiece with leftover overcut as leftover extra run that still sits past a fixed intended stop:

- `overcut` — millimetres of leftover extra run past a fixed stop (default 8)

Derived picture:

- leftover labelled as a sketch (stopped / showing), not a mill sign-off
- leftover overcut labelled as a sketch
- stopped / no leftover overcut when overcut ≤ 1 mm (integer slider means 0 or 1)

Nothing is persisted. Refresh restores the seeded scene. Empty state is named stopped — not “overcut”.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: one workpiece with a fixed intended stop and a leftover saw path that continues past it (not a snipe dip, not a changing kerf width, not a pencil witness line, not a splinter)
- moving a control redraws the leftover immediately; the stop does not move
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- leftover saw path sitting past a fixed stop, not a snipe dip as the hero, not a kerf width as the hero, not a witness line as the hero, not a splinter as the hero, not a ripple as the hero, not a clock
- seeded demo already shows a visible leftover (not a stopped-only cut)
- live leftover overcut, leftover labelled as a sketch (stopped / showing)
- keyboard moves the focused control
- SVG text alternative names whether the overcut is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/overcut/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (one workpiece / leftover saw path past a fixed stop) is in the DOM
- seeded leftover is visible (showing — not stopped)
- changing a control redraws and updates the readout; the stop stays fixed
- empty state is named stopped — not “overcut”
- no paste-well hero, no snipe as the hero, no kerf as the hero, no witness as the hero, no tearout as the hero, no chatter as the hero, no clock face
