# Trammel hook

Tiny drafting-trammel / split-sash classifier for a VS Code focus ping-pong. Two Claude webview panels visible in split editor groups. Each iframe registers a window-level `focus` listener that restores its composer, guarded only by `document.activeElement`. `activeElement` is per-document, so the unfocused panel's `body` passes the guard. `visibility_changed` carries only `isVisible`. `panel.active` is tracked but not sent. `setTimeout(..., 0)` offsets the two cycles. Window regain starts a mutual steal loop. Pipe a probe ticket (`twoVisiblePanels` / `windowRegainedFocus` / `perDocumentActiveElement` / `visibilityIsVisibleOnly` / `panelActiveOmitted` / `timeoutOffset` / `sameEditorGroup` / `inputFlicker` / `typingImpossible`) and get **hunting** or **traced**.

Idle word is **traced**. Seeded state is hunting / #90936. Never idle as "trammel" / "hunting" / "oscillating" / "stolen" / "ping-pong" / "focus" / "flicker" / "split" / "loop" / "soundpost" / "coupled" / "fallen" / "struck" / "torn" / "seated".

```bash
node projects/trammel/hook/trammel.mjs projects/trammel/data/90936.json
node projects/trammel/hook/trammel.mjs projects/trammel/data/traced.json
echo '{"twoVisiblePanels":true,"windowRegainedFocus":true}' | node projects/trammel/hook/trammel.mjs
node --test projects/trammel/hook/trammel.test.mjs
```

Empty stdin uses the idle **traced** ticket. Stdout is JSON: `verdict`, `chips[]`, `reasons[]`, `hold`, `alarm`, `idleWord`.

- **TRACED** if only the active panel restores composer — the ellipse is true
- **HUNTING** if two visible panels, window regain, per-document body-guard, isVisible without isActive, setTimeout 0 offset (#90936)
- **SPLIT** if two editor groups both show a Claude tab
- **VISIBLE-NOT-ACTIVE** if `isVisible` is true for both groups and `isActive` is omitted
- **PER-DOCUMENT** if `document.activeElement` is per-iframe
- **BODY-GUARD** if the restore guard is `activeElement === body`
- **TIMEOUT-OFFSET** if `setTimeout(..., 0)` keeps the two cycles offset
- **STEAL-LOOP** if the two composers mutually steal focus
- **IFRAME-FOCUS** if each panel is its own iframe / document
- **NO-ISACTIVE** if `visibility_changed` carries only `isVisible`
- **DUAL-VISIBLE** if both panels report `WebviewPanel.visible === true`
- **FLICKER** if the caret ping-pongs and typing is impossible

Primary: [anthropics/claude-code#90936](https://github.com/anthropics/claude-code/issues/90936). Same-class (cite, not primary): [#71809](https://github.com/anthropics/claude-code/issues/71809), [#79770](https://github.com/anthropics/claude-code/issues/79770), [#89975](https://github.com/anthropics/claude-code/issues/89975), [#32726](https://github.com/anthropics/claude-code/issues/32726), [#74808](https://github.com/anthropics/claude-code/issues/74808). Contrast: same editor group → only one visible → no loop.

NOT Soundpost / Flong / Bulla / Trompe / Davy / Moviola / Census / Callboard.
