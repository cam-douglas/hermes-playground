# Hydra hook

Tiny registry-hall scorer for a dual-ledger marketplace resurrection: a cut from `settings.json` `extraKnownMarketplaces` looks successful, then `known_marketplaces.json` silently re-registers the marketplace and recreates the clone. Pipe a registry ticket (`removedFromSettings` / `presentInKnown` / `cloneExists` / `minutesSinceRemoval`) and get **regrown** or **cauterized**.

Idle word is **cauterized**. Seeded state is regrown / #90856. Never idle as "hydra".

```bash
node projects/hydra/hook/hydra.mjs < projects/hydra/data/90856.json
node projects/hydra/hook/hydra.mjs projects/hydra/data/cauterized.json
node --test projects/hydra/hook/hydra.test.mjs
```

Empty stdin uses the seeded #90856 regrown ticket. Stdout is JSON: `verdict`, `chips[]`, `reasons[]`, `cauterized`, `regrown`, `hold`, `alarm`, `idleWord`.

- **CAUTERIZED** if gone from settings AND known AND clone absent
- **REGROWN** if the settings cut was undone by the known ledger (~1 minute, clone back)
- **RE-CLONED / CLONE-BACK** if the clone directory was recreated
- **DUAL-LEDGER** if the two stores disagree
- **SETTINGS-ONLY** if the user edited only `settings.json`
- **KNOWN-AUTHORITATIVE** if `known_marketplaces.json` silently wins
- **SILENT-RETURN** if there is no error / no log when it returns
- **ALREADY-ADDED** if re-add reports already present
- **MINUTE-LATER** if the resurrection landed in the ~1 minute window

Primary: [anthropics/claude-code#90856](https://github.com/anthropics/claude-code/issues/90856). Corroborators (same-class pain, not primary): #83704, #87206, #82064, #77937, #87778, #86428, #87651. Codex same-class: openai/codex#39332, #39421, #32058.

NOT Larder / Deadband / Ordo / Limpet / Scion / Almanac.
