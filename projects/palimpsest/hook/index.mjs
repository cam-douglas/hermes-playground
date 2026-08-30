#!/usr/bin/env node
/**
 * Palimpsest folio hook. A scraped
 * page is not a holding. Score the
 * undertext or admit underwrit.
 *
 *   echo '{"originalInput":{"command":"sleep 600","timeout":600000},"updatedInput":{"command":"sleep 600 && echo scraped"},"observedTimeoutMs":120000,"exitCode":143,"transcriptShowsTimeout":true}' | node index.mjs
 *   node index.mjs transcript.txt
 *
 * Tiny scorer: originalInput +
 * updatedInput + observed timeout
 * → underwrit vs scraped (or a
 * named sibling-drop / cliff).
 *
 * NOT Spile / Tappet / Ambo /
 * Quoin / Gaff / Escutcheon /
 * Lacuna. Idle word is underwrit.
 */
import { readFileSync } from "node:fs";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";
import { decide, parseTranscript, seedScraped } from "./palimpsest.mjs";

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stdin.on("data", (chunk) => chunks.push(chunk));
    stdin.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) {
        resolve(seedScraped());
        return;
      }
      resolve(parsePayload(raw));
    });
    stdin.on("error", reject);
  });
}

function parsePayload(raw) {
  const text = String(raw || "").trim();
  if (!text) return seedScraped();
  try {
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed.action || parsed.palimpsest || parsed.probe || parsed.folio
        ? parsed
        : { action: "score", palimpsest: parseTranscript(parsed) };
    }
  } catch {
    const palimpsest = parseTranscript(text);
    return { action: "score", palimpsest };
  }
  return { action: "score", palimpsest: parseTranscript(text) };
}

function shouldDeny(result) {
  return Boolean(result.alarm);
}

function denyMessage(result) {
  if (result.verdict === "scraped") {
    return "Palimpsest scraped. Command-only updatedInput replaced the whole tool input. Siblings are gone.";
  }
  if (result.verdict === "sibling-lost") {
    return "Palimpsest sibling-lost. timeout / run_in_background / description absent after the rewrite.";
  }
  if (result.verdict === "timeout-killed") {
    return "Palimpsest timeout-killed. SIGTERM at the 2m default. Exit 143. The transcript still shows the model's timeout.";
  }
  if (result.verdict === "bg-dropped") {
    return "Palimpsest bg-dropped. run_in_background was silently lost.";
  }
  if (result.verdict === "partial-write") {
    return "Palimpsest partial-write. The hook authored only {command}.";
  }
  if (result.verdict === "transcript-lies") {
    return "Palimpsest transcript-lies. Assistant tool_use still shows timeout. Runtime used the 120s default.";
  }
  if (result.verdict === "post-rewrite-cliff") {
    return "Palimpsest post-rewrite-cliff. canAutoBackground scored the rewritten shape. Killed at 2m instead of backgrounded.";
  }
  return "Palimpsest refuse. A scraped page is not a holding.";
}

export async function handle(payload = {}) {
  const result = decide(payload);
  const deny = shouldDeny(result);
  return {
    hook_event_name: "PreToolUse",
    permissionDecision: deny ? "deny" : "allow",
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: deny ? "deny" : "allow",
      decision: {
        behavior: deny ? "deny" : "allow",
        message: deny
          ? denyMessage(result)
          : result.verdict === "merged-keeps"
            ? "Palimpsest merged-keeps. Full copy+override. Timeout honored. Contrast that proves merge would fix."
            : "Palimpsest underwrit. Full merge. Siblings preserved. Idle word is underwrit.",
        interrupt: deny,
      },
    },
    ...result,
  };
}

const asCli = Boolean(process.argv[1]) && import.meta.url === pathToFileURL(process.argv[1]).href;
if (asCli) {
  const fileArg = process.argv.slice(2).find((arg) => !arg.startsWith("--"));
  const payload = fileArg ? parsePayload(readFileSync(fileArg, "utf8")) : await readStdin();
  const out = await handle(payload);
  process.stdout.write(`${JSON.stringify(out)}\n`);
}
