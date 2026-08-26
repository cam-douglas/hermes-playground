# Scuff

The face was scraped, but a scuff still sits. Move the leftover scuff. See the residual shallow abraded mark still sitting on a fixed face after abrasion.

This is not Burn. Burn is scorch from the cut. This is not Bruise. Bruise is compression after pressure. This is not Dent. Dent is a round impact crush after a blow. This is not Fuzz. Fuzz is a fibre field after sanding. This is not Whisker. Whisker is hair at the edge after the plane. This is not Stain. Stain is a colour wash. This is not sanding advice. This is not a mill sign-off. Scuff answers “how long leftover abraded streak still sits on a fixed face after abrasion.”

## Problem

The face was scraped, but a scuff still sits:

- how much leftover sitting scuff still sits on a fixed face after abrasion?
- is the leftover buffed, or showing?
- when is the leftover scuff obvious — as a sketch, not a mill sign-off?

Existing tools in this catalogue measure leftover burns, leftover bruises, leftover dents, leftover fuzz, leftover packed sky, leftover desk-keys, leftover desk-pins. They do not show leftover scuff — leftover shallow abraded mark still sitting on a fixed face after abrasion, not Burn leftover scorch, not Bruise leftover compression, not Dent leftover round crush, not Fuzz leftover fibre field.

## Users

- people who already know a scrape can still leave one leftover scuff sitting on the face as a shallow abraded streak
- anyone who refuses to treat a burn scorch, a bruise compression field, a round dent crush, a fuzz fibre field, a packed sky, or a clock as this leftover
- desks that want scuff as a sketch, not a mill sign-off, and not sanding advice
- teams that want a no-backend, local-only pass — not Burn, not Bruise, not Dent, not a paste well

## Workflow

1. Load the seed: 4 mm of leftover scuff — already showing, not a buffed-only face
2. Read the scene: one workpiece, one fixed face, a leftover whose leftover is one leftover abraded streak sitting on that face, leftover labelled as a sketch
3. Move leftover scuff (or use the arrow keys on the focused slider); leftover names showing or buffed
4. Drop the leftover toward 0 mm and the face looks buffed / no leftover scuff; raise it and a longer leftover scuff still sits on a fixed face
5. Reset restores the seeded leftover showing

## Data model

One workpiece with leftover scuff as leftover shallow abraded mark that still sits on a fixed face after abrasion:

- `scuff` — millimetres of leftover sitting scuff length on a fixed face after abrasion (default 4)

Derived picture:

- leftover labelled as a sketch (buffed / showing), not a mill sign-off
- leftover scuff labelled as a sketch
- buffed / no leftover scuff when scuff ≤ 1 mm (integer slider means 0 or 1)

Nothing is persisted. Refresh restores the seeded scene. Empty state is named buffed — not “scuff”.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: one workpiece with a fixed face and one leftover shallow abraded streak sitting on that face (not a burn scorch, not a bruise compression field, not a round dent crush, not a fuzz fibre field)
- moving a control redraws the leftover immediately; the face does not move
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- leftover abraded streak sitting on a fixed face after abrasion, not a burn scorch as the hero, not a bruise compression field as the hero, not a round dent as the hero, not a fuzz fibre field as the hero, not a clock
- seeded demo already shows a visible leftover (not a buffed-only face)
- live leftover scuff, leftover labelled as a sketch (buffed / showing)
- keyboard moves the focused control
- SVG text alternative names whether the scuff is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/scuff/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (one workpiece / leftover abraded streak sitting on a fixed face after abrasion) is in the DOM
- seeded leftover is visible (showing — not buffed)
- changing a control redraws and updates the readout; the face stays fixed
- empty state is named buffed — not “scuff”
- no paste-well hero, no burn as the hero, no bruise as the hero, no dent as the hero, no fuzz as the hero, no clock face
