# Reveille

Living muster board for in-flight agent handles. Compaction forgets who is still in the field. Workflow run records appear on disk only at completion, so the session concludes nothing is live and re-dispatches onto the same artifact. Reveille keeps heartbeats and artifact claims across that boundary. Duplicate dispatch is **held**. A missed beat is **orphan / missing**.

Not Quench. Not Scrim. Not Knock. Not a leftover slider.

## Live catalog path

`/reveille/` is this static board. Demo works with no secrets and no npm.

1. Seeded collision session `compact-90036` is already on the roll: implementer live on `src/auth/session.ts`, tester live, docs past the 90s TTL → orphaned.
2. **Try duplicate dispatch** holds the second claim on the same artifact.
3. **Fire compaction** increments the count. The roster stays.
4. **Re-attach missing** heartbeats the orphan back to live.
5. **Stand down** empties the board. Idle word is **quiet**. Never the product name.
6. Slack / GitHub / Linear rows are honest demo copy unless env keys exist on the hook.

## Hook

`projects/reveille/hook/` accepts a muster snapshot and answers `clear`, `hold`, or `orphan`. See `hook/README.md`.

```bash
node projects/reveille/hook/index.mjs --listen 8790
node --test projects/reveille/hook/muster.test.mjs
```

## Evidence (do not invent more)

- [anthropics/claude-code#90036](https://github.com/anthropics/claude-code/issues/90036) — compaction loses track of in-flight agents; duplicate work
- [anthropics/claude-code#90034](https://github.com/anthropics/claude-code/issues/90034) — running workflow leaves no on-disk record; dispatch collides
- [anthropics/claude-code#29193](https://github.com/anthropics/claude-code/issues/29193) — background task handles orphaned after compaction
- [anthropics/claude-code#77730](https://github.com/anthropics/claude-code/issues/77730) — agent/task IDs stop resolving across a session-identity boundary
