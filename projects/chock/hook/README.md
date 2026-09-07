# Chock hook

Tiny Node scorer for the timber wheel-chock / dry-dock chock yard. No secrets. No live Claude sessions. No live session JSONL. No payloads. Educational diagnostic only — does not call Read/Grep/Glob and is not an exploit.

```bash
node projects/chock/hook/index.mjs projects/chock/data/92582.json
echo '{"seed":"admitted","admitted":true}' | node projects/chock/hook/index.mjs
node --test projects/chock/hook/chock.test.mjs
```

Empty stdin scores the seeded **admitted** ticket. A probe with `seed: "barred"` and user-only fence + header-lists-all scores **barred**. Locomotive deadman cabs / glass-plate rpm bays / Lydian slabs / dockside bitts / bosun seizing yarn / stuffing-box glands / watchtower larums / Fairlead URI chock-rails are not this product.

Exports: `VERDICTS`, `CHIPS`, `HOLD`, `ALARM`, `decide()`, `analyze()`, `classify()`, `score()`, `scoreFields()`, `handle()`, `seeds()`, `seedBarred()`, `seedAdmitted()`, `fingerprint()`, `MEASURED`, `COUSINS`, `IDLE_WORD`, `SEEDED_WORD`, `SETTINGS_LAYERS`, `fenceAdmitsProjectLocal()`.

HOLD = admitted. ALARM = barred / user-only-fence / header-lists-all / project-ignored / local-ignored / sandbox-allowWithinDeny / add-dir-works / unattended-blocked / cousins / has-clear-repro.

Verdicts: barred, admitted, user-only-fence, header-lists-all, project-ignored, local-ignored, sandbox-allowWithinDeny, add-dir-works, unattended-blocked, cousins, has-clear-repro.

`decide()` scores fixture objects by `seed`, flags, or a diagnostic settings-layer probe. Idle header-lists-all + user-only fence + sandbox allowWithinDeny → barred. Project + local additionalDirectories merge into the read fence and sandbox allowlist once trust is accepted → admitted.
