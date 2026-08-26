# Gouge

The tool has passed, but a gouge still sits. Move the leftover gouge. See the residual curved hollow still sitting in a fixed face after the carve.

This is not Chip. Chip is a discrete flake from the chisel. This is not Nick. Nick is a V-shaped bite in a cut edge. This is not Tearout. Tearout is a splinter torn at the cut. This is not Burr. Burr is a ragged displaced lip along a cut. This is not Bruise. Bruise is compression after pressure. This is not Dent. Dent is a face dent from a blow — not a carved hollow. This is not Flute. Flute is an intentional flute moulding. This is not carving advice. This is not a mill sign-off. Gouge answers “how deep leftover scooped hollow still sits in a fixed face after the carve.”

## Problem

The tool has passed, but a gouge still sits:

- how much leftover sitting gouge still sits in a fixed face after the carve?
- is the leftover filled, or showing?
- when is the leftover gouge obvious — as a sketch, not a mill sign-off?

Existing tools in this catalogue measure leftover chips, leftover edge nicks, leftover tearout splinters, leftover burr lips, leftover bruises, leftover flute mouldings, leftover packed sky, leftover desk-keys, leftover desk-pins. They do not show leftover gouge — leftover curved hollow still sitting in a fixed face after the carve, not Chip leftover flake, not Nick leftover V bite, not Tearout leftover splinter, not Flute leftover moulding.

## Users

- people who already know a carve can still leave one leftover gouge sitting in the face as a scooped curved hollow
- anyone who refuses to treat a chip flake, an edge nick V, a tearout splinter, a burr lip, a bruise dent, a flute moulding, a packed sky, or a clock as this leftover
- desks that want gouge as a sketch, not a mill sign-off, and not carving advice
- teams that want a no-backend, local-only pass — not Chip, not Nick, not Tearout, not a paste well

## Workflow

1. Load the seed: 5 mm of leftover gouge — already showing, not a filled-only face
2. Read the scene: one workpiece, one fixed face, a leftover whose leftover is one leftover scooped hollow sitting in that face, leftover labelled as a sketch
3. Move leftover gouge (or use the arrow keys on the focused slider); leftover names showing or filled
4. Drop the leftover toward 0 mm and the face looks filled / no leftover gouge; raise it and a deeper leftover gouge still sits in a fixed face
5. Reset restores the seeded leftover showing

## Data model

One workpiece with leftover gouge as leftover curved hollow that still sits in a fixed face after the carve:

- `gouge` — millimetres of leftover sitting gouge depth in a fixed face after the carve (default 5)

Derived picture:

- leftover labelled as a sketch (filled / showing), not a mill sign-off
- leftover gouge labelled as a sketch
- filled / no leftover gouge when gouge ≤ 1 mm (integer slider means 0 or 1)

Nothing is persisted. Refresh restores the seeded scene. Empty state is named filled — not “gouge”.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: one workpiece with a fixed face and one leftover scooped curved hollow sitting in that face (not a chip flake, not an edge nick V, not a tearout splinter, not a flute moulding)
- moving a control redraws the leftover immediately; the face does not move
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- leftover scooped hollow sitting in a fixed face after the carve, not a chip flake as the hero, not an edge nick as the hero, not a tearout splinter as the hero, not a flute moulding as the hero, not a clock
- seeded demo already shows a visible leftover (not a filled-only face)
- live leftover gouge, leftover labelled as a sketch (filled / showing)
- keyboard moves the focused control
- SVG text alternative names whether the gouge is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/gouge/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (one workpiece / leftover scooped hollow sitting in a fixed face after the carve) is in the DOM
- seeded leftover is visible (showing — not filled)
- changing a control redraws and updates the readout; the face stays fixed
- empty state is named filled — not “gouge”
- no paste-well hero, no chip as the hero, no nick as the hero, no tearout as the hero, no flute as the hero, no clock face
