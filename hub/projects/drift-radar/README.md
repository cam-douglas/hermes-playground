# Drift Radar

A local-first recovery console for autonomous work that has started to drift.

## Problem

Autonomous agents usually have plenty of forward motion tools, but weak recovery tools. When a run stalls, teams need to know:

- what the agent intended to do
- what actually happened
- whether the blocker is data, permissions, context, or scope
- what the safest next action is

## Users

- coding agents running in loops
- human operators supervising long tasks
- support engineers triaging stalled automations
- project owners who need a clean recovery packet

## Workflow

1. Capture the intended step and the observed state.
2. Classify the blocker.
3. Compute drift score and urgency.
4. Choose one of: continue, reframe, escalate, or reset.
5. Persist the decision locally for the next handoff.

## Data model

Each step tracks:

- `name`
- `objective`
- `observed`
- `blocker`
- `owner`
- `confidence`
- `nextAction`
- `lastTouch`

Derived values:

- `driftScore`
- `status` (`on-track`, `drifting`, `blocked`)
- `recovery priority`

## Architecture

- static HTML/CSS/JS
- localStorage persistence
- deterministic scoring
- no backend required for the prototype

## Verification

- page loads without a build step
- edits persist after refresh
- blocker changes reshuffle the recovery queue
- the add-step form injects a new run into the dashboard
