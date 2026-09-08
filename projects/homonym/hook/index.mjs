#!/usr/bin/env node
/**
 * Homonym lexicographer twin-nameplate hook.
 * Score orphaned or admit keyed.
 *
 *   echo '{"seed":"orphaned"}' | node index.mjs
 *   node index.mjs ../data/92787.json
 *
 * No live Claude sessions. Diagnostic only. No secrets. No payloads.
 */
import { main } from "./homonym.mjs";

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
