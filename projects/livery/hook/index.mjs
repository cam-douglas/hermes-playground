#!/usr/bin/env node
/**
 * Livery wardrobe hook. A new
 * coat of the same house is not
 * a stranger. Score the wardrobe
 * or admit liveried.
 *
 *   echo '{"executablePath":"/Users/user/Library/Application Support/Claude/claude-code/2.1.247/claude.app/Contents/MacOS/claude","dialogText":"\\"2.1.247\\" wants to access files managed by \\"Dropbox\\".","grantsOnNewPath":0,"grantsOnOldPath":7,"overnight":true}' | node index.mjs
 *   node index.mjs transcript.txt
 *
 * Tiny scorer: executablePath +
 * dialogText + TCC observation →
 * liveried vs prompted (or a
 * named nearby class).
 *
 * NOT Pinfold / Palimpsest /
 * Escutcheon / Chatelaine / Fob /
 * Visa / Sigil / Hasp / Knock /
 * Slype / Pleat. Idle word is
 * liveried.
 */
import { readFileSync } from "node:fs";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";
import { decide, parseTranscript, seedPrompted } from "./livery.mjs";

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stdin.on("data", (chunk) => chunks.push(chunk));
    stdin.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) {
        resolve(seedPrompted());
        return;
      }
      resolve(parsePayload(raw));
    });
    stdin.on("error", reject);
  });
}

function parsePayload(raw) {
  const text = String(raw || "").trim();
  if (!text) return seedPrompted();
  try {
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed.action || parsed.livery || parsed.probe || parsed.wardrobe || parsed.coat
        ? parsed
        : { action: "score", livery: parseTranscript(parsed) };
    }
  } catch {
    const livery = parseTranscript(text);
    return { action: "score", livery };
  }
  return { action: "score", livery: parseTranscript(text) };
}

function shouldDeny(result) {
  return Boolean(result.alarm);
}

function denyMessage(result) {
  if (result.verdict === "prompted") {
    return "Livery prompted. Versioned desktop path. Zero grants on the new coat. Burst of TCC dialogs. #90748.";
  }
  if (result.verdict === "path-churn") {
    return "Livery path-churn. Every desktop update mints a new executable path under claude-code/<version>/.";
  }
  if (result.verdict === "bare-version") {
    return 'Livery bare-version. Dialog shows "2.1.NNN" rather than an app name.';
  }
  if (result.verdict === "tcc-orphan") {
    return "Livery tcc-orphan. Previous version's grants still sit on the old path. The new path has zero rows.";
  }
  if (result.verdict === "fda-inert") {
    return "Livery fda-inert. Full Disk Access on /Applications/Claude.app does not cover the separately-pathed child.";
  }
  if (result.verdict === "cloud-mount") {
    return "Livery cloud-mount. One kTCCServiceFileProviderDomain prompt per cloud mount.";
  }
  if (result.verdict === "overnight-burst") {
    return "Livery overnight-burst. Stack of modal dialogs, typically first thing after an overnight update.";
  }
  if (result.verdict === "stranger-path") {
    return "Livery stranger-path. A bare version number reads as a mystery process.";
  }
  if (result.verdict === "version-folder") {
    return "Livery version-folder. Desktop owns and recreates claude-code/<version>/. CLI symlink trick is unavailable.";
  }
  return "Livery refuse. A new coat of the same house is not a stranger.";
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
          : result.verdict === "current-shim"
            ? "Livery current-shim. Launch from .../claude-code/current/... TCC keys a stable path."
            : result.verdict === "signed-stable"
              ? "Livery signed-stable. Identifier=com.anthropic.claude-code Team Q6L2SF6YDW already stable. Only path churn is the bug."
              : "Livery liveried. Stable current path. House identity already signed. Grants persist. Idle word is liveried.",
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
