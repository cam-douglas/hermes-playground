# Whisker

The plane has passed, but a whisker still sits at the edge. Move the leftover whisker. See the residual hair of wood still standing at a planed or cut edge.

This is not Fuzz. Fuzz is a field of standing fibres after sanding. This is not Tearout. Tearout is one splinter torn at the cut. This is not Burr. Burr is a ragged displaced lip along a cut. This is not Nib. Nib is a compact leftover at intersecting cuts. This is not Feather. Feather is figure. This is not planing advice. This is not a mill sign-off. Whisker answers “how long the leftover hair of wood still sits at a fixed edge.”

## Problem

The plane has passed, but a whisker still sits at the edge:

- how much leftover standing hair still sits at a planed or cut edge?
- is the leftover shaved, or showing?
- when is the leftover whisker obvious — as a sketch, not a mill sign-off?

Existing tools in this catalogue measure leftover fibre fields, leftover splinters, leftover lips, leftover corner projections, leftover figure, leftover packed sky, leftover desk-keys, leftover desk-pins. They do not show leftover whisker — leftover hair of wood that still stands at a fixed edge after planing or cutting, not Fuzz leftover field, not Tearout leftover splinter, not Burr leftover lip, not Nib leftover corner.

## Users

- people who already know a plane or cut can still leave one leftover hair sitting at an edge
- anyone who refuses to treat a fuzz field, a torn splinter, a burr lip, a corner nib, a packed sky, or a clock as this leftover
- desks that want whisker as a sketch, not a mill sign-off, and not planing advice
- teams that want a no-backend, local-only pass — not Fuzz, not Tearout, not Burr, not a paste well

## Workflow

1. Load the seed: 3 mm of leftover whisker — already showing, not a shaved-only edge
2. Read the scene: one workpiece, one fixed planed or cut edge, a leftover whose leftover is one hair at that edge, leftover labelled as a sketch
3. Move leftover whisker (or use the arrow keys on the focused slider); leftover names showing or shaved
4. Drop the leftover toward 0 mm and the edge looks shaved / no leftover whisker; raise it and a longer leftover hair still sits at a fixed edge
5. Reset restores the seeded leftover showing

## Data model

One workpiece with leftover whisker as leftover hair of wood that still stands at a fixed planed or cut edge:

- `whisker` — millimetres of leftover standing hair length at a fixed edge (default 3)

Derived picture:

- leftover labelled as a sketch (shaved / showing), not a mill sign-off
- leftover whisker labelled as a sketch
- shaved / no leftover whisker when whisker ≤ 1 mm (integer slider means 0 or 1)

Nothing is persisted. Refresh restores the seeded scene. Empty state is named shaved — not “whisker”.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: one workpiece with a fixed planed or cut edge and one leftover hair of wood standing at that edge (not a fuzz field, not a torn splinter, not a burr lip, not a corner nib)
- moving a control redraws the leftover immediately; the edge does not move
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- leftover hair of wood sitting at a fixed edge, not a fuzz field as the hero, not a splinter as the hero, not a burr lip as the hero, not a corner nib as the hero, not a clock
- seeded demo already shows a visible leftover (not a shaved-only edge)
- live leftover whisker, leftover labelled as a sketch (shaved / showing)
- keyboard moves the focused control
- SVG text alternative names whether the whisker is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/whisker/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (one workpiece / leftover hair at a fixed edge) is in the DOM
- seeded leftover is visible (showing — not shaved)
- changing a control redraws and updates the readout; the edge stays fixed
- empty state is named shaved — not “whisker”
- no paste-well hero, no fuzz as the hero, no tearout as the hero, no burr as the hero, no nib as the hero, no clock face
