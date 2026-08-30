#!/usr/bin/env node
/**
 * Escutcheon plate hook. An empty
 * plate is not a keyhole. Score
 * the door or admit plated.
 *
 *   echo '{"mountinfo":"… tmpfs … /run/user","dbusAddress":"unix:path=/run/user/1000/bus","ghStatus":"The token in default is invalid."}' | node index.mjs
 *   node index.mjs transcript.txt
 *
 * Tiny scorer: mountinfo + env +
 * gh status → plated vs blamed
 * (or a named lever fail).
 *
 * NOT Slype / Gasket / Clew / Fob
 * / Chatelaine / Lacuna / Ambo.
 * Idle word is plated.
 */
import { readFileSync } from "node:fs";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";
import { decide, parseTranscript, seedBlamed } from "./escutcheon.mjs";

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stdin.on("data", (chunk) => chunks.push(chunk));
    stdin.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) {
        resolve(seedBlamed());
        return;
      }
      resolve(parsePayload(raw));
    });
    stdin.on("error", reject);
  });
}

function parsePayload(raw) {
  const text = String(raw || "").trim();
  if (!text) return seedBlamed();
  try {
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed.action || parsed.escutcheon || parsed.probe || parsed.plate
        ? parsed
        : { action: "score", escutcheon: parseTranscript(parsed) };
    }
  } catch {
    const escutcheon = parseTranscript(text);
    return { action: "score", escutcheon };
  }
  return { action: "score", escutcheon: parseTranscript(text) };
}

function shouldDeny(result) {
  return Boolean(result.alarm);
}

function denyMessage(result) {
  if (result.verdict === "blamed") {
    return "Escutcheon blamed. gh says the token is invalid. The plate over /run/user is empty.";
  }
  if (result.verdict === "masked") {
    return "Escutcheon masked. Empty tmpfs over /run/user. The D-Bus socket is gone.";
  }
  if (result.verdict === "lying-address") {
    return "Escutcheon lying-address. DBUS_SESSION_BUS_ADDRESS still points at a missing path.";
  }
  if (result.verdict === "sockets-inert") {
    return "Escutcheon sockets-inert. allowUnixSockets is not implemented on Linux.";
  }
  if (result.verdict === "excluded-inert") {
    return "Escutcheon excluded-inert. excludedCommands still sandboxes gh.";
  }
  if (result.verdict === "still-masks") {
    return "Escutcheon still-masks. dangerouslyDisableSandbox leaves the empty tmpfs.";
  }
  if (result.verdict === "plaintext-forced") {
    return "Escutcheon plaintext-forced. Only gh auth login --insecure-storage works.";
  }
  if (result.verdict === "deny-breaks") {
    return "Escutcheon deny-breaks. permissions.deny on hosts.yml breaks gh itself.";
  }
  return "Escutcheon refuse. An empty plate is not a keyhole.";
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
          : "Escutcheon plated. Real runtime dir bound. Keyring reachable. Idle word is plated.",
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
