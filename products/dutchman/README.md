# Dutchman

A face looks open until you see the dutchman. Move the patch. See the leftover repair still sitting in the face.

This is not Inlay. Inlay is leftover contrasting piece still sitting as decoration set into a face. This is not Bowtie. Bowtie is leftover butterfly patch still sitting across a split. This is not Biscuit. Biscuit is leftover oval wafer still sitting in an edge. This is not Tearout. Tearout is leftover splinter that still sits at the cut. This is not Chatter. Chatter is leftover ripple that still sits from the cut. This is not Pecky. Pecky is leftover cavity that still sits in the face. This is not Knot. Knot is leftover dark that still sits in the figure. This is not a cut-list. This is not a paste well. This is not a clock. Dutchman answers “how much leftover repair patch still sits in the face.”

## Problem

A face looks open until you see the dutchman:

- how much leftover repair patch still sits in a defect in the face?
- is the leftover open, or showing?
- when is the leftover dutchman obvious — as a sketch, not a mill sign-off?

Existing tools in this catalogue measure leftover contrasting set-in decoration, leftover butterfly patch across a split, leftover wafer in an edge, leftover splinter at a cut, leftover ripple from a cut, leftover cavity, leftover dark in the figure, leftover millimetres of stock, leftover paper creases, leftover packed sky, leftover desk-keys, leftover desk-pins. They do not show leftover dutchman — leftover repair patch still sitting in a defect in the face, leftover dutchman still sitting in the face, not Inlay leftover set into a face, not Bowtie leftover butterfly patch for a split.

## Users

- people who already know a face can look open until the leftover repair patch shows in the defect
- anyone who refuses to treat an inlay set, a bowtie butterfly, a biscuit wafer, a tearout splinter, a chatter ripple, a pecky cavity, a packed sky, or a clock as this leftover
- desks that want dutchman as a sketch, not a mill sign-off
- teams that want a no-backend, local-only pass — not Inlay, not Bowtie, not Biscuit, not Tearout, not a paste well

## Workflow

1. Load the seed: 12 mm of leftover patch — already showing, not an open-only face
2. Read the scene: one face, a leftover whose leftover is the dutchman, leftover labelled as a sketch
3. Move leftover dutchman (or use the arrow keys on the focused slider); leftover names showing or open
4. Drop the leftover toward 0 mm and the face looks open / no leftover dutchman; raise it and a larger leftover patch still sits in the face
5. Reset restores the seeded leftover showing

## Data model

One face with leftover dutchman as leftover repair patch that still sits in a defect:

- `dutchman` — millimetres of leftover patch (default 12)

Derived picture:

- leftover labelled as a sketch (open / showing), not a mill sign-off
- leftover patch labelled as a sketch
- open / no leftover dutchman when patch ≤ 2 mm (the face looks open, no leftover patch)

Nothing is persisted. Refresh restores the seeded scene.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: one face — a leftover whose leftover is the dutchman; leftover is leftover repair patch still sitting in a defect (not an inlay set, not a bowtie butterfly, not a biscuit wafer, not tearout)
- moving a control redraws the leftover immediately
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- leftover repair patch still sitting in a defect of one face, not an inlay set as the hero, not a bowtie butterfly as the hero, not a biscuit wafer as the hero, not a tearout splinter as the hero, not a chatter ripple as the hero, not a clock
- seeded demo already shows a visible leftover (not an open-only face)
- live leftover dutchman, leftover labelled as a sketch (open / showing)
- keyboard moves the focused control
- SVG text alternative names whether the dutchman is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/dutchman/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (one face / defect / leftover dutchman) is in the DOM
- seeded leftover is visible (showing — not open)
- changing a control redraws and updates the readout
- no paste-well hero, no inlay set as the hero, no bowtie butterfly as the hero, no biscuit wafer as the hero, no tearout splinter as the hero, no clock face
