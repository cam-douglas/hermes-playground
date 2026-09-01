# Riddle hook

Tiny riddle-sieve classifier for Devcontainer firewall init abort on duplicate IP. Official stock `.devcontainer` / `init-firewall.sh` runs under `set -euo pipefail`. The per-domain resolution loop does `ipset add allowed-domains "$ip"`. When two allowlisted domains resolve to the same IP, the second add errors: `ipset v7.17: Element cannot be added to the set: it's already added`. `set -e` aborts the script; `postStartCommand` exits 1; the container comes up without completing firewall initialization.

Idle word is **sifted**. Seeded state is jammed / #91327 (two domains → one IP; `ipset add` without `-exist`; set -e abort; postStartCommand exit 1; firewall unfinished). Never idle as jammed / stocked / aired / drained / hinged / pealed / warded / first-wins / seized / pooled.

```bash
node projects/riddle/hook/riddle.mjs projects/riddle/data/91327.json
node projects/riddle/hook/riddle.mjs projects/riddle/data/sifted.json
echo '{"ipsetAddExist":false,"duplicateIp":true,"setEAbort":true,"postStartExit":1,"firewallFinished":false}' | node projects/riddle/hook/riddle.mjs
node --test projects/riddle/hook/riddle.test.mjs
```

Empty stdin uses the idle **sifted** ticket. Stdout is JSON: `verdict`, `chips[]`, `reasons[]`, `sifted`, `jammed`, `hold`, `alarm`, `idleWord`.

Given `{ ipsetAddExist, duplicateIp, setEAbort, postStartExit, firewallFinished, ipsetWithoutExist, resolvedIp, ipsetError }`:

- **SIFTED** if `ipset add -exist`; duplicate IPs accepted; firewall init finishes; postStartCommand 0
- **JAMMED** if two domains → one IP; `ipset add` without `-exist`; set -e abort; postStartCommand exit 1; firewall unfinished (#91327)
- **DUPLICATE-IP** if two allowlisted domains resolve to the same IP (`150.171.74.16`)
- **SET-E-ABORT** if `set -euo pipefail` aborts on the second `ipset add`
- **POSTSTART-EXIT-1** if `postStartCommand` exits 1
- **FIREWALL-UNFINISHED** if the container comes up without completing firewall initialization
- **IPSET-WITHOUT-EXIST** if the per-domain loop does `ipset add` without `-exist`
- **SHARED-CDN-IP** if CDN-fronted allowlist domains share `150.171.74.16`
- **ALLOWLIST-CDN-DOMAINS** if `marketplace.visualstudio.com` and `vscode.blob.core.windows.net` are on the stock allowlist
- **HOLD** if the mesh is sifted (`-exist` accepted the duplicate pour)

This is a diagnostic scoring bench. Not an exploit. No payloads. Score whether the mesh is sifted or jammed.

Primary: [anthropics/claude-code#91327](https://github.com/anthropics/claude-code/issues/91327). Cousins (cite only, not primaries): [#35197](https://github.com/anthropics/claude-code/issues/35197) closed stale, same class init-firewall fails on duplicate IPs from DNS; [#15611](https://github.com/anthropics/claude-code/issues/15611) closed stale, same class, PR #19871 existed for `-exist` fix; [#67130](https://github.com/anthropics/claude-code/issues/67130) closed, related, had to comment out marketplace/vscode.blob domains to launch; [openai/codex#22471](https://github.com/openai/codex/issues/22471) OPEN, cross-ecosystem, secure devcontainer firewall aborts when DNS returns CNAME alongside A records.

Hypothesis only (NON-BINDING): missing `ipset add -exist` (or dedupe before add) under `set -e` is the defect; CDN-fronted allowlist domains sharing an IP is expected; aborting firewall init on a duplicate is unhealthy. Do not claim a root cause in Claude Code source you have not seen.

NOT grain loft / garner / millrace / sluice-gate / pool-gauge / peal-board / belfry / carillon / postern-gate / night bailey / plane-table / alidade / rudder pintle / gudgeon / woodworking / mm-slider. Product name stays Riddle. Do not rename to Sieve / Mesh / Screen / Grate / Filter / Hopper / Garner / Pintle / Carillon / Postern / Sluice.
