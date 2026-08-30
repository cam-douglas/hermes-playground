#!/usr/bin/env node
/**
 * Fetch parlor hook. A fetch on
 * the glass is not a keyed reply.
 * Score the pane or admit muted.
 *
 *   echo '{"promptSuggestionEnabled":true,"suggestionSource":"prompt_suggestion","ghostText":"Yes, go ahead","capturePaneText":"❯ Yes, go ahead","composerMarked":false,"channelsActive":true,"submittedAsUser":true}' | node index.mjs
 *   node index.mjs transcript.txt
 *
 * Tiny scorer: promptSuggestionEnabled
 * + source=prompt_suggestion +
 * capturePaneText → muted vs
 * ghosted (or a named nearby class).
 *
 * Different problem: TUI ghost-text
 * / headless scrape / fabricated
 * user authorship. NOT packaging,
 * NOT AV, NOT hooks rewrite, NOT
 * OAuth, NOT DLP, NOT permission
 * stall.
 *
 * NOT Livery / Pinfold / Palimpsest
 * / Escutcheon / Chatelaine / Fob /
 * Visa / Sigil / Hasp / Knock /
 * Slype / Scrim / Chute / Ambo /
 * Byline. Idle word is muted.
 * NEVER use muted for a failure.
 */
import { readFileSync } from "node:fs";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";
import { decide, parseTranscript, seedGhosted } from "./fetch.mjs";

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stdin.on("data", (chunk) => chunks.push(chunk));
    stdin.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) {
        resolve(seedGhosted());
        return;
      }
      resolve(parsePayload(raw));
    });
    stdin.on("error", reject);
  });
}

function parsePayload(raw) {
  const text = String(raw || "").trim();
  if (!text) return seedGhosted();
  try {
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed.action || parsed.fetch || parsed.probe || parsed.pane || parsed.glass
        ? parsed
        : { action: "score", fetch: parseTranscript(parsed) };
    }
  } catch {
    const fetch = parseTranscript(text);
    return { action: "score", fetch };
  }
  return { action: "score", fetch: parseTranscript(text) };
}

function shouldDeny(result) {
  return Boolean(result.alarm);
}

function denyMessage(result) {
  if (result.verdict === "ghosted") {
    return "Fetch ghosted. Suggestion rendered as ghost text on the ❯ input line. #90755.";
  }
  if (result.verdict === "scraped") {
    return "Fetch scraped. capture-pane / pane scrape sees byte-identical suggestion text.";
  }
  if (result.verdict === "fabricated") {
    return "Fetch fabricated. Suggestion submitted as a real user message.";
  }
  if (result.verdict === "fake-approve") {
    return 'Fetch fake-approve. Fabricated approval like "Yes, go ahead" was acted on.';
  }
  if (result.verdict === "self-loop") {
    return "Fetch self-loop. Each reply generates a fresh suggestion which is resubmitted.";
  }
  if (result.verdict === "unmarked") {
    return "Fetch unmarked. No machine-readable marker / glyph / prefix on the suggestion line.";
  }
  if (result.verdict === "default-on") {
    return "Fetch default-on. promptSuggestionEnabled is default on.";
  }
  if (result.verdict === "channel-blind") {
    return "Fetch channel-blind. Suggestions still on under --channels / headless.";
  }
  if (result.verdict === "byte-identical") {
    return "Fetch byte-identical. Styled ghost equals typed bytes after scrape.";
  }
  if (result.verdict === "watchdog-fed") {
    return "Fetch watchdog-fed. Automation treats the suggestion as stuck human input.";
  }
  if (result.verdict === "suggestion-source") {
    return "Fetch suggestion-source. Debug source=prompt_suggestion.";
  }
  return "Fetch refuse. A fetch on the glass is not a keyed reply.";
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
          : "Fetch muted. Suggestions off or marked. Input line is keyed-only. Idle word is muted.",
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
