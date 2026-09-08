#!/usr/bin/env node
/**
 * Setoff letterpress set-off bench hook.
 * Score laden or admit shed.
 *
 *   echo '{"seed":"laden"}' | node index.mjs
 *   node index.mjs ../data/92750.json
 *
 * No live Claude sessions. Diagnostic only. No secrets. No payloads.
 */
import { main } from "./setoff.mjs";

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
