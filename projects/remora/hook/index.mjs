#!/usr/bin/env node
import { main } from "./remora.mjs";

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
