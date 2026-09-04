# Ephemera hook

Tiny archive / wick-lit folio classifier for the Claude Code defect where Fable 5.1 background subagents sit on the 5-minute ephemeral prompt-cache TTL, so a single long turn (thinking + tools) burns the wick and the next request reprints the whole folio. Reporter lucascampolina. Filed 2026-09-04. Labels: bug, has repro, platform:macos, area:cost, area:agents. Claude Code 2.1.258 (data). macOS 26 (Darwin 25.6.0). `claude-fable-5-1`.

Idle word is **banked**. Seeded state is rewritten / #92090 (`cache_creation.ephemeral_5m` is huge and `cache_read` ≈ system prefix on a non-first call). Never idle as keyed / strayed / scrubbed / pulled / enacted / withheld / masked / bled / crossed / homed.

```bash
node projects/ephemera/hook/ephemera.mjs projects/ephemera/data/92090.json
node projects/ephemera/hook/ephemera.mjs projects/ephemera/data/banked.json
echo '{"call":8,"firstCall":false,"cache_read_input_tokens":33578,"cache_creation":{"ephemeral_5m_input_tokens":213484}}' | node projects/ephemera/hook/ephemera.mjs
node --test projects/ephemera/hook/ephemera.test.mjs
```

Empty stdin uses the idle **banked** ticket. Stdout is JSON: `verdict`, `chips[]`, `reasons[]`, `banked`, `rewritten`, `hold`, `alarm`, `idleWord`.

Given a usage-shaped payload `{ cache_read_input_tokens, cache_creation.ephemeral_5m_input_tokens, call, firstCall }`:

- **BANKED** if `cache_read` is the folio and `ephemeral_5m` is only the new leaf (the wick still holds)
- **REWRITTEN** if `ephemeral_5m` is huge and `cache_read` ≈ the system prefix (33,578) on a non-first call (#92090)
- **EPHEMERAL-5M** if the TTL bucket is the documented 5-minute subagent wick
- **SYSTEM-PREFIX** if `cache_read_input_tokens` is pinned at 33,578
- **CACHE-CREATION** if `usage.cache_creation.ephemeral_5m_input_tokens` equals the whole conversation
- **CACHE-READ** if the read side collapsed to the prefix instead of the folio
- **FABLE-5-1** if the same-week comparison pins the rewrites on `claude-fable-5-1`
- **PARALLEL-EIGHT** if a parent launched 8 research subagents and 10 rewrites landed in under 40 minutes
- **HOLD** if the wick banks the folio

This is a diagnostic scoring desk. Not an exploit. No payloads. No real credentials. Score whether the wick banked the folio or already reprinted it.

Primary: [anthropics/claude-code#92090](https://github.com/anthropics/claude-code/issues/92090). Cousins (cite only, not primary): [#84289](https://github.com/anthropics/claude-code/issues/84289) docs vs reality on subagent TTL, [#87215](https://github.com/anthropics/claude-code/issues/87215) parked-wake re-cache, [#89621](https://github.com/anthropics/claude-code/issues/89621) multimodal re-cache, [#91289](https://github.com/anthropics/claude-code/issues/91289) Fable 5.1 burning limits.

Hypothesis only (NON-BINDING): background subagents sit on the documented 5-minute ephemeral prompt-cache TTL; a single Fable 5.1 turn often takes 5–10 minutes, so the next request reprints the folio at cache-write rates. Discard if issue evidence disagrees. Do not claim Claude Code source you have not seen.

NOT leftover commutator drum / hectograph gelatin / congregation placet / print-shop frisket / compaction ullage / clockmaker fusee / sounding fathom / living reveille. Product name stays Ephemera.
