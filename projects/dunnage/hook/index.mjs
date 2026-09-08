#!/usr/bin/env node
/**
 * Dunnage stevedore dunnage-crib hook.
 * Score echoed or admit advanced.
 *
 *   echo '{"seed":"echoed"}' | node index.mjs
 *   node index.mjs ../data/92746.json
 *
 * No live Claude sessions. Diagnostic only. No secrets. No payloads.
 */
import { main } from "./dunnage.mjs";

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
