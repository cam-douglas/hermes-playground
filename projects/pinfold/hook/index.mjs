#!/usr/bin/env node
/**
 * Pinfold yard hook. A penned
 * spawn is not a hold. Score the
 * fold or admit penned.
 *
 *   echo '{"composedCommand":"pwsh -NoProfile -NonInteractive -ExecutionPolicy Bypass -Command …ReadAllBytes…","threatName":"Trojan:Win32/FileFix.BBA!MTB","resourceType":"CmdLine","spawnError":"EPERM: operation not permitted, uv_spawn '\''…pwsh.exe'\''","events":[1116],"didThreatExecute":false}' | node index.mjs
 *   node index.mjs transcript.txt
 *
 * Tiny scorer: composedCommand +
 * threatName + spawnError +
 * events → penned vs flagged
 * (or a named nearby class).
 *
 * NOT Slype / Escutcheon /
 * Palimpsest / Calque / Gasket /
 * Fob / Chatelaine. Idle word
 * is penned.
 */
import { readFileSync } from "node:fs";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";
import { decide, parseTranscript, seedFlagged } from "./pinfold.mjs";

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stdin.on("data", (chunk) => chunks.push(chunk));
    stdin.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) {
        resolve(seedFlagged());
        return;
      }
      resolve(parsePayload(raw));
    });
    stdin.on("error", reject);
  });
}

function parsePayload(raw) {
  const text = String(raw || "").trim();
  if (!text) return seedFlagged();
  try {
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed.action || parsed.pinfold || parsed.probe || parsed.fold || parsed.yard
        ? parsed
        : { action: "score", pinfold: parseTranscript(parsed) };
    }
  } catch {
    const pinfold = parseTranscript(text);
    return { action: "score", pinfold };
  }
  return { action: "score", pinfold: parseTranscript(text) };
}

function shouldDeny(result) {
  return Boolean(result.alarm);
}

function denyMessage(result) {
  if (result.verdict === "flagged") {
    return "Pinfold flagged. FileFix.BBA!MTB matched the CmdLine. Spawn never started. Bare EPERM uv_spawn pwsh.exe.";
  }
  if (result.verdict === "eperm-bare") {
    return "Pinfold eperm-bare. Only visible error is EPERM: operation not permitted, uv_spawn '...pwsh.exe'.";
  }
  if (result.verdict === "cmdline-shape") {
    return "Pinfold cmdline-shape. Long inline Bypass -Command plus a byte-patch body.";
  }
  if (result.verdict === "filefix") {
    return "Pinfold filefix. Threat name Trojan:Win32/FileFix.BBA!MTB.";
  }
  if (result.verdict === "toast-only") {
    return "Pinfold toast-only. The user saw a Windows Security toast. The model saw nothing in-band.";
  }
  if (result.verdict === "billed-retry") {
    return "Pinfold billed-retry. Retries are guaranteed to fail and are billed.";
  }
  if (result.verdict === "events-1116") {
    return "Pinfold events-1116. Defender 1116/1117. DidThreatExecute False. No file quarantined.";
  }
  if (result.verdict === "undiagnosed") {
    return "Pinfold undiagnosed. No in-band hint this is AV vs sandbox vs a broken alias.";
  }
  return "Pinfold refuse. A penned spawn is not a hold.";
}

export async function handle(payload = {}) {
  const result = decide(payload);
  const deny = shouldDeny(result);
  return {
    hook_event_name: "PermissionRequest",
    permissionDecision: deny ? "deny" : "allow",
    hookSpecificOutput: {
      hookEventName: "PermissionRequest",
      permissionDecision: deny ? "deny" : "allow",
      decision: {
        behavior: deny ? "deny" : "allow",
        message: deny
          ? denyMessage(result)
          : result.verdict === "script-clears"
            ? "Pinfold script-clears. Same logic in a .ps1 invoked by path. Spawn ok. The cmdline shape is the trigger."
            : "Pinfold penned. Short command or .ps1 by path. Spawn ok. No FileFix. Idle word is penned.",
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
