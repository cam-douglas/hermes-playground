# Embrasure fixtures

Diagnostic JSON only. No payloads. No live Claude sessions. Encoded from #92365 issue facts: if ANY entry of `sandbox.filesystem.denyRead` or `denyWrite` is NOT a string (object `{"path":"~/.ssh"}` or a number), Claude Code 2.1.261 accepts the settings with exit 0, no warning, empty stderr — then applies **neither** `permissions.deny` **nor** any `PreToolUse` hook for that run. Fail-open. A `Read` of a path covered by `permissions.deny` succeeds; the PreToolUse witness hook never fires (`witness.txt` is never written). Deleting the `sandbox` key entirely restores enforcement. So adding a sandbox deny list that looks MORE restrictive makes the file STRICTLY LESS restrictive.

Idle word: **open**. Seeded word: **witnessed**. Primary: [anthropics/claude-code#92365](https://github.com/anthropics/claude-code/issues/92365). Seed primary as fail-open / open / witnessed-false.

| File | Verdict | What it scores |
|---|---|---|
| `open.json` | open | Idle fail-open fence. Object denyRead; wall gone; witness dark. |
| `held.json` | held | Contrast hold. String denyRead; curtain wall intact; witness lamp on. |
| `92365.json` | open | Primary fixture alias for #92365. Fail-open / open / witnessed-false. |
| `case-string.json` | held | Good case: denyRead entry is a string. Hook invoked; command refused. |
| `case-object.json` | open | Bad case: same path as `{"path":…}`. Hook never invoked; command ran. |
| `case-number.json` | open | Bad case: denyRead `[42]`. Same fail-open as the object form. |
| `case-absent.json` | held | Sandbox key absent entirely. Hook invoked; denied command refused. |
| `case-unknown-key.json` | held | Unknown key inside sandbox is harmless. Hook invoked; refused. |
| `additional-dirs-unaffected.json` | held | `additionalDirectories` string/object/number/null all harmless. |
| `repro.json` | open | Published repro: string vs object, `--settings` + `--setting-sources ''`. |
| `remediation-reject.json` | held | Fail loudly: refuse to start on a non-string denyRead/denyWrite entry. |
| `remediation-warn.json` | held | Warn + ignore the sandbox block; never weaker than the key-absent row. |
| `cousins.json` | stay-off | Cite-only cousins + stay-off catalog surfaces. |
| `fixtures.json` | index | Row list for the battlement assay. |

Drop any file onto `projects/embrasure/index.html` or paste the JSON. The living page seeds **open** / witnessed-false.
