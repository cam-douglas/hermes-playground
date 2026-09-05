# Priory fixtures

Diagnostic JSON only. No payloads. No live AppX install. Encoded from #92345 issue facts: Claude Desktop Windows MSIX ships a ~1,480-byte `priconfig.xml` in the package root. That file declares `<autoResourcePackage>` for Language, Scale, and DXFeatureLevel, so Windows looks for separate resource packages during Evaluated/resource-indexing. The MSIX is a single package, not a bundle. Lookup returns `0x80070490` ERROR_NOT_FOUND, wrapped as `0x80073CF9` ERROR_INSTALL_FAILED. The installer then lies: "Administrator access is required" / "install without Cowork" while its own log already shows `Is elevated: true`. Deleting that one file from the ~627 MB package makes the install succeed, Cowork included.

Idle word: **sealed**. Seeded word: **leaked**. Primary: [anthropics/claude-code#92345](https://github.com/anthropics/claude-code/issues/92345).

| File | Verdict | What it scores |
|---|---|---|
| `sealed.json` | sealed | Idle hold. `priconfig.xml` not in package root. Install proceeds. |
| `leaked.json` | leaked | Seeded #92345. `priconfig.xml` in root → phantom resource lookup. |
| `92345.json` | leaked | Primary fixture alias for #92345. |
| `hresult.json` | wrap | Chain `0x80070490` ERROR_NOT_FOUND → `0x80073CF9` ERROR_INSTALL_FAILED. |
| `priconfig.json` | phantom | `autoResourcePackage` qualifiers Language / Scale / DXFeatureLevel. |
| `appx-log.json` | stage-zero | AppXDeployment Operational: Evaluated fail; Stage cost 0 ms. |
| `elevate.json` | false-abbot | Installer admin/Cowork banner vs `Is elevated: true`. |
| `cure.json` | excised | Official package minus `priconfig.xml` installs; CoworkVMService Running. |
| `phantom.json` | phantom | Resource packages looked for, never packed (single MSIX, not a bundle). |
| `spanish.json` | spanish-guess | Unverified: es-ES display vs package `Language=en-US`. |
| `timestamps.json` | stage-zero | Indexing 62 ms / Evaluation 47 ms / Stage 0 ms. |
| `package-tree.json` | leaked | MSIX root tree with the 1,480-byte leak at the cloister door. |
| `cousins.json` | stay-off | Cite-only MSIX/AppX cousins + stay-off catalog surfaces. |
| `fixtures.json` | index | Row list for the scoring desk. |

Drop any file onto `projects/priory/index.html` or paste the JSON. The living page seeds **leaked**.
