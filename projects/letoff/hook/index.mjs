#!/usr/bin/env node
/**
 * Letoff action-rail hook.
 * Score flattened or admit meshed.
 *
 *   echo '{"seed":"flattened"}' | node index.mjs
 *   node index.mjs ../data/92771.json
 *
 * No live Claude sessions. Diagnostic only. No secrets. No payloads.
 */
import { main } from "./letoff.mjs";

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
