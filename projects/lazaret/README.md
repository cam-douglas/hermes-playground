# Lazaret

Lazaretto / yellow-jack / pratique desk for Claude Code per-Read malware system-reminders that refuse legitimate files. A written reminder is **not** a hold. Score the desk or admit **pratique**.

A lazaret is the quarantine station for arriving ships. The yellow jack is not a hold. A per-Read malware system-reminder that fires on legitimate code is a false cordon. In an unattended cloud coding-agent seat there is no human to grant pratique, and a hard wall-clock budget turns the refusal into total loss of the run.

Idle word: **pratique** (a ship's health clearance after quarantine).
NEVER use the product name lazaret / quarantine / empty / malware / reminder as the idle/state word.
NEVER reuse prior idles: bound, stilled, drained, flat, fit, spoilt, laid, unlinked, tight, banked, roosted, stocked, seated, heard, clear, paired, kernel, latched, upheld, sterling, home, valid, dry, sealed, quiet, seised, stabled, wound. Do not ship Quarantine, Cordon, Lazaretto, Plague, Yellow, Flag, Pratique (as a product name), Pest, Hospital, Infirmary, Isolation, Lockdown, Malware, Reminder, Refuse, Safety, Yellowjack, Jack, Quebec, Bill, Health, Scrim, Knock, or Veto.

Verdicts: **pratique**, **refused**, **lost**, **stranded**, **cordoned**, **yellow**, **false**, **timed**, **held**, **passed**. Slack lazaret alarm on refused / lost / stranded / cordoned / yellow / false / timed. Linear ticket on refused / lost / stranded / false. GitHub lazaret-ledger of bill events on every scored probe.

## Why not a clone

NOT Fusee (clockmaker fusee / early schedule dispatch).
NOT Iota (typesetter's type-case / path-key identity).
NOT Leat (mill leat / sleep-block unbounded until-loop).
NOT Shunt (night railway / nested SendMessage misroute).
NOT Knock (fail-loud relay for stalled *permission grants* — different: permissions vs safety-reminder refusal).
NOT Scrim (runtime DLP redacting tool_result — different: redaction vs false-positive malware refusal).
NOT Veto (CLAUDE.md overlay).
NOT Sigil (hollow thinking signature).
NOT Wicket (isolation pin / worktree).
NOT Sump / Pleat / Scant / Chad / Kist / Wraith / Gasket / Damper / Cote / Larder / Tappet / Aside / Chute / Tain / Husk / Snib / Assay / Stencil / Suture / Blot / Coda / Reed / Fathom / Hasp / Parity / Reveille / Quench.
NOT leftover woodworking / millimetre-slider clones.
Do NOT ship Quarantine, Cordon, Lazaretto, Plague, Yellow, Flag, Pratique (as a product name), Pest, Hospital, Infirmary, Isolation, Lockdown, Malware, Reminder, Refuse, Safety, Yellowjack, Jack, Quebec, Bill, Health, Scrim, Knock, or Veto as alternate product names this hour. Product name is **Lazaret** only.

Different problem: safety-reminder false positive on legitimate files bricks unattended cloud-agent seats; no human to confirm; hard timeout is total loss.
Different UI: lazaretto / quarantine island / yellow jack / pratique desk / bill of health / inspection lantern / stone hospital on a spit of rock / salt air. Sea-stone, ochre yellow jack, tarred rope, salt-white lime, verdigris lamp, tide. NOT brass enamel clock. NOT typesetter case. NOT millrace. NOT railway. NOT basement. NOT tailor. NOT timber. NOT ballot. NOT coffin. NOT steam. NOT dove-cote. NOT chimney. NOT permission-knock door. NOT DLP scrim.
Different idle word: **pratique**.

## Live catalog path

`/lazaret/` is this static lazaretto desk. Yellow jack, inspection lantern, bill of health. Demo works with no secrets and no npm. Mark: `11:50 Sydney · lazaret`.

1. Seeded `#90326` **lost** is already on the bill: unattended cloud seat refused a legitimate module, asked for confirm, 15-minute budget died, no files written → **lost**.
2. Switch **refused** — interactive subagent refused a legitimate module → **refused**.
3. Switch **stranded** — confirmation asked, nobody in the session → **stranded**.
4. Switch **cordoned** — reminder fired, work stopped, waiting → **cordoned**.
5. Switch **yellow** — reminder fired on a legitimate file → **yellow**.
6. Switch **false** — classified false-positive → **false**.
7. Switch **timed** — budget exhausted waiting for confirm → **timed**.
8. Switch **held** — reminder fired, classification uncertain → **held**.
9. Switch **passed** — human confirmed, work proceeded → **passed**.
10. Switch **Bail · pratique** — reminder not a hold, nothing scored → **pratique**. Idle word is **pratique** when the probe is idle.
11. **Score** scores. **Bail** returns idle pratique. **Bill** shows the #90326 lost strike. Admit does not lie: a lost probe stays lost.

## Hook

`projects/lazaret/hook/` scores a probe `{ reminderFired, fileKind:"legitimate"|"unknown"|"malware", refused, humanPresent, confirmationRequested, confirmationReceived, budgetMs, stalledMs, timedOut, workDone, observed, session, source, issue, scored }` and returns `{ verdict, reasons[], cluster[], pratique, refused, lost }`. See `hook/README.md`.

```bash
node projects/lazaret/hook/index.mjs --listen 9090
node --test projects/lazaret/hook/lazaret.test.mjs
```

## Evidence (do not invent more)

Primary:

- [anthropics/claude-code#90326](https://github.com/anthropics/claude-code/issues/90326) — filed 2026-08-28, open. Title: "Malware Read-reminder still causes refusals (2026-08-28) — and in unattended cloud agent seats the refusal is unrecoverable". Per-Read malware system-reminder still causes refusals on legitimate code four months after earlier issues were closed. Reproduced on a GitHub Agent HQ cloud coding-agent seat. The agent read a legitimate TypeScript company-intelligence module, correctly described it as not malware, then refused to improve it "per the system reminder" and asked a human to confirm. Nobody was in the session. COPILOT_AGENT_TIMEOUT_MIN: 15. No files written. No commits. Seat timed out waiting for a confirmation no human could send.

Corroboration (cite as shape, not a new primary):

- [anthropics/claude-code#52272](https://github.com/anthropics/claude-code/issues/52272) — closed. Read tool's malware-safety reminder causes subagents to refuse legitimate code augmentation.
- [anthropics/claude-code#49363](https://github.com/anthropics/claude-code/issues/49363) — closed. Regression: malware reminder on every Read still causes subagent refusals in v2.1.111 (fix from #47027 / v2.1.92 did not hold).
- [anthropics/claude-code#47027](https://github.com/anthropics/claude-code/issues/47027) — closed. Malware check prompts causing rapid quota exhaustion and code analysis refusals.
- [anthropics/claude-code#49484](https://github.com/anthropics/claude-code/issues/49484) — closed. Read tool results have a "considered malware" system-reminder appended, causing model to refuse legitimate edits.
- [anthropics/claude-code#50760](https://github.com/anthropics/claude-code/issues/50760) — closed. Read tool results contain an injected system-reminder about "malware".
