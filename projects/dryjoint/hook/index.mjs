#!/usr/bin/env node
/**
 * Dryjoint electronics dry-joint / cold-solder bench hook.
 * Score dry or admit bonded.
 *
 *   echo '{"seed":"dry"}' | node index.mjs
 *   node index.mjs ../data/92809.json
 *
 * No live Claude sessions. Diagnostic only. No secrets. No payloads.
 */
import { main } from "./dryjoint.mjs";

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
