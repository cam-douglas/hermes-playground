# Postern hook

Tiny bailey classifier for UDS messaging directory tenancy. After 2.1.248 the shared primary `/tmp/cc-socks` is still first-come, and the per-uid postern `/tmp/cc-socks-<uid>` is public and tried once. A local account can take both names. Messaging turns off. DoS only — `peerToken` holds.

Idle word is **warded**. Seeded state is squatted / #91223 (another uid owns primary AND per-uid fallback; messaging off). Never idle as squatted / postern / sluice / drained / pooled / stationed / displaced / hung / marvered / unpinned / shed / sealed / rinsed / vacant.

```bash
node projects/postern/hook/postern.mjs projects/postern/data/91223.json
node projects/postern/hook/postern.mjs projects/postern/data/warded.json
echo '{"sessionUid":501,"primaryDirOwnerUid":502,"fallbackDirOwnerUid":502,"messagingOn":false}' | node projects/postern/hook/postern.mjs
node --test projects/postern/hook/postern.test.mjs
```

Empty stdin uses the idle **warded** ticket. Stdout is JSON: `verdict`, `chips[]`, `reasons[]`, `warded`, `squatted`, `hold`, `alarm`, `idleWord`.

- **WARDED** if the session uid owns the sockets dir it uses (or a private XDG that is honored) and messaging is on (hold)
- **SQUATTED** if another uid owns primary AND per-uid fallback; messaging off (#91223 case 2)
- **FIRST-COME** if shared `/tmp/cc-socks` is owned by whoever started first (case 1)
- **BOOT-ORDER** if the winner can change after a `/tmp` clear / reboot
- **POSTERN-REFUSED** if the per-uid fallback also failed the owner check
- **NO-THIRD-DOOR** if there is no `$HOME` fallback before giving up
- **PREDICTABLE-UID** if the fallback name is public `cc-socks-<uid>`
- **WORKAROUND-XDG** if `XDG_RUNTIME_DIR=/tmp/claude-<uid>` keeps messaging (35-byte path)
- **FALLBACK-IGNORES-XDG** if `nNn()` ignores `XDG_RUNTIME_DIR` / `CLAUDE_CODE_TMPDIR`
- **DOS-ONLY** if peerToken + owner check stop message theft (cite chip; not a hold)
- **PEER-PATH-OK** if case 1 still discovers via sessions json
- **STATUS-SILENT** if the refusal is not reported in `/status`

This is a diagnostic scoring bench. Not an exploit, attack PoC, or remote-access how-to. No payloads. No squat cookbook. Score whether the postern is warded or squatted.

Primary: [anthropics/claude-code#91223](https://github.com/anthropics/claude-code/issues/91223). Cousin (not primary): [#89401](https://github.com/anthropics/claude-code/issues/89401) CLOSED — symptom treated in 2.1.248.

Hypothesis only (NON-BINDING): UDS messaging directory tenancy — a shared first-come primary plus a predictable per-uid postern with no third door under `$HOME`. Do not claim a root cause in Claude Code source you have not seen.

NOT Sluice / Alidade / Parison / Cockade / Lye / Limpet / Quench / Bulla / Cubby / Bitting / Chatelaine / Pale / Berth. Product name stays Postern. Do not rename to Wicket / Hatch / Lodge / Scuttle / Coaming / Bailey / Gatehouse / Sallyport / Porter / Letterbox.
