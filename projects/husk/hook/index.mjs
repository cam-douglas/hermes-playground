#!/usr/bin/env node
/**
 * Husk CLI. A husk is not a hold. Score the envelope. Name the class or admit kernel.
 *
 *   claude -p "/skill" --output-format json | node index.mjs
 *   claude -p "/skill" --output-format stream-json --verbose | node index.mjs
 *
 * Exit 0 only for kernel. Every hollow class (husked, aborted, denied, nested,
 * contended, zeroed, ghosted) exits 1 — even when Claude itself exited 0.
 */
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";
import { exitCode, formatScore, handle } from "./adapters.mjs";
import {
  IDLE_WORD,
  VERDICTS,
  score,
  seed2197,
  seed80223,
  seed87159,
  seedKernel,
} from "./husk.mjs";

export {
  IDLE_WORD,
  VERDICTS,
  handle,
  score,
  seed2197,
  seed80223,
  seed87159,
  seedKernel,
};

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stdin.on("data", (chunk) => chunks.push(chunk));
    stdin.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    stdin.on("error", reject);
  });
}

const asCli = Boolean(process.argv[1]) && import.meta.url === pathToFileURL(process.argv[1]).href;
if (asCli) {
  const seedFlag = process.argv.find((arg) => arg.startsWith("--seed"));
  if (seedFlag) {
    const name = process.argv[process.argv.indexOf(seedFlag) + 1] || seedFlag.split("=")[1] || "87159";
    const seeds = { 87159: seed87159, 80223: seed80223, 2197: seed2197, kernel: seedKernel };
    const payload = (seeds[name] || seed87159)();
    const out = score(payload);
    process.stdout.write(formatScore(out));
    process.exit(exitCode(out));
  } else {
    const raw = await readStdin();
    const out = handle(raw);
    process.stdout.write(formatScore(out));
    process.exit(exitCode(out));
  }
}
