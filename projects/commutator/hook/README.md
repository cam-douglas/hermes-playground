# Commutator hook

Tiny rotary brush-gear / segment drum classifier for the Claude Code defect where a concurrent MCP `tools/call` batch on one `Mcp-Session-Id` over streamable-http can report `Tool call timed out waiting for server response` while the late real result lands in a sibling call's slot. Reporter keithkessleraz. Filed 2026-09-04. Labels: bug, has repro, platform:macos, area:mcp. Claude Code 2.1.185. macOS 26.5.2. Remote MCP streamable-http via the claude.ai connector. FastMCP 3.2.4.

Idle word is **keyed**. Seeded state is strayed / #91958 (slow call reports timeout while the late real result lands in a sibling slot). Never idle as scrubbed / pulled / enacted / withheld / masked / bled / crossed / homed / slipped / fouled / mangled / verbatim / unbolted / snagged.

```bash
node projects/commutator/hook/commutator.mjs projects/commutator/data/91958.json
node projects/commutator/hook/commutator.mjs projects/commutator/data/keyed.json
echo '{"siblingSlot":true,"lateReply":true}' | node projects/commutator/hook/commutator.mjs
node --test projects/commutator/hook/commutator.test.mjs
```

Empty stdin uses the idle **keyed** ticket. Stdout is JSON: `verdict`, `chips[]`, `reasons[]`, `keyed`, `strayed`, `hold`, `alarm`, `idleWord`.

Given `{ persistHold, keyed, strayed, siblingSlot, lateReply, jsonRpcIdMatched, timedOutTool, landedInTool, timeoutMessage, batchSize, transport, sessionId }`:

- **KEYED** if each concurrent `tools/call` result matches its own JSON-RPC id and a late reply never seats a sibling
- **STRAYED** if a slow call reports timeout while its real result lands in a sibling slot (#91958)
- **STREAMABLE-HTTP** if the batch ran over remote MCP streamable-http via the claude.ai connector
- **MCP-SESSION** if the batch shared one `Mcp-Session-Id`
- **TOOLS-CALL-BATCH** if concurrent `tools/call` requests were issued in one turn (batch 12 or batch 3)
- **JSON-RPC-ID** if results should key to their own JSON-RPC id and a late reply never attaches to a different call
- **LATE-REPLY** if the real result arrived after the client's per-call timeout
- **SIBLING-SLOT** if the timed-out call's payload landed in a sibling call's slot
- **CLIENT-TIMEOUT** if the client reported `Tool call timed out waiting for server response` while the handler completed server-side
- **SERVER-EXONERATED** if the hand-rolled sweep (28 configs × 5, batches 3 and 12, ~1200 calls) recorded zero misroutes and the SSE GET carried zero reply frames
- **SEQUENTIAL-CLEAN** if a sequential re-run of the same calls was clean
- **WELL-FORMED-WRONG** if the model received a well-formed but wrong tool result with no signal
- **HAS-CLEAR-REPRO** if the issue is OPEN with has-repro on platform:macos area:mcp
- **HOLD** if the drum keys each result to its own segment

This is a diagnostic scoring desk. Not an exploit. No payloads. No real credentials. Score whether the drum keyed each result or already seated a late reply on a sibling.

Primary: [anthropics/claude-code#91958](https://github.com/anthropics/claude-code/issues/91958). Cousins (cite only, not primary): [#91414](https://github.com/anthropics/claude-code/issues/91414) MCP HTTP first-turn `subscriptions/listen` freeze, [#92046](https://github.com/anthropics/claude-code/issues/92046) Windows `Claude_Browser` MCP registers zero tools, [#92065](https://github.com/anthropics/claude-code/issues/92065) `mcp__claude-in-chrome__*` absent on Windows MSIX.

Hypothesis only (NON-BINDING): after the client's per-call timeout, a late reply attaches to a still-pending sibling instead of matching strictly by JSON-RPC id. Discard if issue evidence disagrees. Do not claim Claude Code source you have not seen.

NOT leftover hectograph gelatin / congregation placet / print-shop frisket / clavichord tangent / dockyard hawser / proof-desk caret / harbor-buoy / solecism usage-desk / coffer vault / codicil probate / crimp pliers / jackfield channel-strip / tocsin fire-bell / bolter flour-mill / deadeye standing-rigging. Product name stays Commutator.
