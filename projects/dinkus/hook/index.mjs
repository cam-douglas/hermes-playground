#!/usr/bin/env node
/**
 * Dinkus compositor's hairline-rule bench hook.
 * Score leaked or admit closed.
 *
 *   echo '{"seed":"leaked"}' | node index.mjs
 *   node index.mjs ../data/92798.json
 *
 * No live Claude sessions. Diagnostic only. No secrets. No payloads.
 */
import { main } from "./dinkus.mjs";

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
