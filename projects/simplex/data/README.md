# Simplex fixtures

Diagnostic JSON only. No Claude sessions. Encoded from #93801 issue facts: with `claude remote-control`, phone send vanishes while desktop→phone still reads. Score simplex or admit duplex.

Idle word: **duplex**. Path word: **mobile-uplink-silent**. Seeded loss: **simplexed**. Product: **simplex**. HOLD: **duplex**. ALARM: **simplexed** / **simplex** / **mobile-uplink-silent** / **uplink-vanish** / **silent-send** / **dual-network** / **cleared-app-data**. Primary: [anthropics/claude-code#93801](https://github.com/anthropics/claude-code/issues/93801).

Fixtures record the published incident only. No session. No secrets. No exploit payloads. No network to Anthropic. No Claude. No patch to anthropics/claude-code.

| File | Verdict | What it scores |
|---|---|---|
| `duplex.json` | duplex | Idle chassis. HOLD: both legs open; phone send reaches the CLI. |
| `hold.json` | hold | HOLD alias for idle duplex. |
| `simplexed.json` | simplexed | Seeded #93801 path. ALARM: mobile uplink never delivers. |
| `simplex.json` | simplex | Product score for the half-duplex radio chassis. |
| `mobile-uplink-silent.json` | mobile-uplink-silent | Path: write path from the handset never delivers. |
| `downlink-ok.json` | downlink-ok | Desktop → phone still streams. |
| `uplink-vanish.json` | uplink-vanish | Phone message disappears; never on the CLI. |
| `silent-send.json` | silent-send | No error, no queued/pending state. |
| `dual-network.json` | dual-network | Restaurant wifi + carrier 5G. |
| `cleared-app-data.json` | cleared-app-data | Cleared phone app data + brand-new session. |
| `has-repro.json` | has-repro | Published shape. |
| `cousins.json` | cousins | Cite-only #62284 #34619 #45946. |
| `backups.json` | backups | Cite-only backups. Do not auto-pick. |
| `fixtures.json` | fixtures | Night chassis / RX downlink / TX uplink / amber carrier. |
| `walk.json` | walk | Published idle duplex → mobile-uplink-silent → simplexed → simplex. |

## Backups (cite only — do NOT auto-pick or build)

#93798 #93786 #93778 #93766 #93764 #93754 #93751 #93744 #93772 #93770 #93777 #93782

Drop any file onto `projects/simplex/index.html`. Buttons load the seeded path. The living page admits **duplex** / idle chassis / #93801.

Probes are diagnostic reconstructions of the issue's published facts. This booth does not run Claude.
