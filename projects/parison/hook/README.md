# Parison hook

Tiny glasshouse classifier for the parent-side subagent wedge. Headless Agent SDK sessions on claude-fable-5 at xhigh effort with heavy parallel Task fan-out enter a permanent silent wedge: subagents complete (256+ files on disk) but results never reconcile to the parent. `activeTaskIds` stays full, `resultCount = 0`, `awaiting_post_task_result = true`. The SDK event stream stops entirely while the container stays healthy. No terminal `result` ⇒ `total_cost_usd` never reported.

Idle word is **marvered**. Seeded state is hung / #91037 (occurrence 3: 34 active, 0 results, 256+ files, silent 900s, SDK 0.3.251). Never idle as hung / parison / glory / noria / dry / stilled / unpinned / cocked / rinsed / scrubbed / vacant / reserved / shed / clamped / sealed / torn / cauterized.

```bash
node projects/parison/hook/parison.mjs projects/parison/data/91037.json
node projects/parison/hook/parison.mjs projects/parison/data/marvered.json
echo '{"activeTasks":34,"resultCount":0,"awaitingPostTaskResult":true,"filesWritten":256,"eventStream":"silent"}' | node projects/parison/hook/parison.mjs
node --test projects/parison/hook/parison.test.mjs
```

Empty stdin uses the idle **marvered** ticket. Stdout is JSON: `verdict`, `chips[]`, `reasons[]`, `hold`, `alarm`, `idleWord`.

- **MARVERED** if the parent received results, the stream is live, cost is reported, and the ledger is settled
- **HUNG** if the parent is wedged with results 0, files exist, and the stream is silent (#91037)
- **TRANSFERRED** if the parison was taken onto the punty and parent results match files (hold)
- **OPUS-HOLDS** if the same harness completes on claude-opus-5 (contrast chip, not the idle word)
- **SILENT-STREAM** if the event stream stopped while the container stayed healthy
- **UNRECONCILED** / **LEDGER-FULL** / **ZERO-RESULTS** / **AWAITING-POST** if `activeTaskIds` stays full, `resultCount = 0`, `awaiting_post_task_result = true`
- **FILES-WRITTEN** if 256+ files exist while the parent has 0 results
- **COST-UNREPORTED** if no terminal result ⇒ `total_cost_usd` never emitted
- **FABLE-XHIGH** / **SDK-WEDGE** if Fable 5 xhigh + Agent SDK 0.3.197 / 0.3.251

Primary: [anthropics/claude-code#91037](https://github.com/anthropics/claude-code/issues/91037). Cousins (not primaries): #47936 inverse; #59962 leftover in_progress; Sounder #90555 TUI waiter completes / notification never re-invokes (different host, child, freeze); also #37521 #61547 #28482.

Hypothesis only (NON-BINDING): parent-side result-reconciliation wedge on Fable-5 xhigh parallel Task fan-out. Do not claim a root cause in Claude Code or SDK source you have not seen.

NOT Suture / Limpet / Reveille / Hydra / Almanac / Cockade / Lye / Advowson / Pawl / Tappet / Leat / Sounder. Do not ship Noria / Culvert / Weir / Flume / Millrace. Product name stays Parison.
