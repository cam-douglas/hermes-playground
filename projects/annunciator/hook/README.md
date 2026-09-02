# Annunciator hook

Tiny industrial annunciator / false-alarm panel classifier for the Claude Code hook path that lights `StopFailure` for internal helper forks and background subagent 429s on the parent `session_id`. Under `/low-priority` an idle prompt rains spurious failures. Measured fourteen `StopFailure` hooks in about a minute for one underlying limit (nine background agents; seven died on 429). Claude Code 2.1.258, Windows 11. Reporter KamilDev.

Idle word is **dark**. Seeded state is spurious / #91419 (`StopFailure` for helper forks and background subagent 429s on the parent session_id; `/low-priority` idle drip; 14 hooks/~1min). Never idle as sealed / rebound / fenced / swept / tolled / mute / honored / discarded / arrested / skipped / indexed / jumped / chocked / rolled / clasped / sprung / drained / hinged / pealed / warded / pooled / cased / aired / sifted / stocked / stationed / marvered / unpinned / rinsed / literal / choked / opened / stalled / fused / forged / attributed.

```bash
node projects/annunciator/hook/annunciator.mjs projects/annunciator/data/91419.json
node projects/annunciator/hook/annunciator.mjs projects/annunciator/data/dark.json
echo '{"helperForkStopFailure":true,"parentSessionStamp":true}' | node projects/annunciator/hook/annunciator.mjs
node --test projects/annunciator/hook/annunciator.test.mjs
```

Empty stdin uses the idle **dark** ticket. Stdout is JSON: `verdict`, `chips[]`, `reasons[]`, `dark`, `spurious`, `hold`, `alarm`, `idleWord`.

Given `{ boardDark, mainTurnOnly, helperForkStopFailure, skipTranscript, parentSessionStamp, subagent429Parent, lowPriorityIdleDrip, fourteenHooksCascade, missingQuerySource, rateLimitNullRetry }`:

- **DARK** if the board stays dark until a real main turn ends on an API error and helper forks do not light
- **SPURIOUS** if `StopFailure` lights for helper forks and background subagent 429s on the parent session_id (#91419)
- **HELPER-FORK-STOPFAILURE** if `prompt_suggestion`, `away_summary`, `extract_memories`, `agent_summary` (`skipTranscript: true`) fire `StopFailure` on the parent session_id
- **SUBAGENT-429-PARENT** if background subagent 429 deaths stamp the parent session_id
- **LOW-PRIORITY-IDLE-DRIP** if after `/low-priority` a parked idle prompt rains `StopFailure` ~20–30s apart (`error: rate_limit`) with no transcript line
- **FOURTEEN-HOOKS-CASCADE** if nine background agents / seven 429 deaths produce fourteen `StopFailure` hooks in about a minute (2N cascade)
- **MISSING-QUERY-SOURCE** if the payload is `error`, `error_details`, `last_assistant_message` with no `querySource` / `agent_id`
- **SKIP-TRANSCRIPT-FORK** if helper forks (`skipTranscript: true`) still emit `StopFailure`
- **RATE-LIMIT-NULL-RETRY** if the low-priority retry allow-list excludes helpers so a 429 returns null
- **DELEGATED-OBSERVATION-SKIP** if only delegated-observation is skipped while helper forks still fire
- **HAS-CLEAR-REPRO** if KamilDev filed #91419; has repro; 9/7/14; Claude Code 2.1.258; Windows 11
- **HOLD** if the annunciator is dark (main-turn only; helper lamps unlit)

This is a diagnostic scoring bench. Not an exploit. No payloads. Score whether the board is dark or spurious.

Primary: [anthropics/claude-code#91419](https://github.com/anthropics/claude-code/issues/91419). Cousins (cite only, not primaries): [#87972](https://github.com/anthropics/claude-code/issues/87972) stall→StopFailure decision ignored; [#91414](https://github.com/anthropics/claude-code/issues/91414) MCP listen stall; [#91408](https://github.com/anthropics/claude-code/issues/91408) approve&&merge interrupt; [#91396](https://github.com/anthropics/claude-code/issues/91396) fabricated authorization.

Hypothesis only (NON-BINDING): the shared query generator may treat every API-error exit as a main-turn death because the payload never carries query_source, and /low-priority may return null for helpers instead of waiting. Do not claim a root cause in Claude Code source you have not seen.

NOT leftover woodworking / mm-slider / millrace / locksmith / campanology / berth clones. Product name stays Annunciator. Do not rename to Caisson / Spindle / Knell / Tumbler / Escapement / Geneva / Scotch / Fibula / Virgule / Riddle / Garner / Pintle / Carillon / Postern / Sluice / Alidade / Cockade / Lye / Clew / Hasp / Berth / Bollard.
