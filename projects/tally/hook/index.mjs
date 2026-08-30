#!/usr/bin/env node
/**
 * Tally dock-board hook. A
 * birth-counted tally is not a
 * hold. Score the board or
 * admit squared.
 *
 *   echo '{"birthCount":3,"originCount":0}' | node index.mjs
 *   node index.mjs tally.json
 *   node index.mjs --listen 9090
 *
 * Env:
 *   TALLY_SLACK_WEBHOOK Incoming webhook. Absent → demo "Would post to Slack".
 *   TALLY_GITHUB_TOKEN  Tally-ledger. Absent → demo ledger.
 *   TALLY_LINEAR_KEY    Board ticket. Absent → demo row.
 *
 * NOT Wicket / Fascia / Berth /
 * Pale / leftover woodworking.
 * Idle word is squared, never the
 * product name, never empty, never
 * bound / girt / sheltered /
 * alongside.
 */
import { readFileSync } from "node:fs";
import { createServer } from "node:http";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";
import { fire } from "./adapters.mjs";
import { decide, parseTallyJson, seedFalseLoss } from "./tally.mjs";

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stdin.on("data", (chunk) => chunks.push(chunk));
    stdin.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) {
        resolve(seedFalseLoss());
        return;
      }
      resolve(parsePayload(raw));
    });
    stdin.on("error", reject);
  });
}

function parsePayload(raw) {
  const text = String(raw || "").trim();
  if (!text) return seedFalseLoss();
  try {
    const parsed = JSON.parse(text);
    if (
      parsed &&
      typeof parsed === "object" &&
      !Array.isArray(parsed) &&
      (parsed.action ||
        parsed.tally ||
        parsed.probe ||
        parsed.intake ||
        parsed.board ||
        parsed.birthCount != null ||
        parsed.originCount != null ||
        parsed.dialogClaimsLoss != null)
    ) {
      return parsed.action || parsed.tally || parsed.probe || parsed.intake || parsed.board
        ? parsed
        : { action: "score", tally: parseTallyJson(parsed) };
    }
  } catch {
    const tally = parseTallyJson(text);
    if (tally.birthCount != null || tally.originCount != null) {
      return { action: "score", tally };
    }
    return { error: "unparseable", raw: text };
  }
  const tally = parseTallyJson(text);
  return { action: "score", tally };
}

function shouldDeny(result) {
  return Boolean(result.alarm);
}

function denyMessage(result) {
  if (result.verdict === "false-loss") {
    return "Tally false-loss. Birth count N>0 while origin/main..HEAD is 0. Dialog claims commits will be lost.";
  }
  if (result.verdict === "remount-grew") {
    return "Tally remount-grew. ff-only origin/main grew the birth count while risk shrank.";
  }
  if (result.verdict === "merged-still-n") {
    return "Tally merged-still-n. Regular merge on the remote. CLAUDE_BASE..HEAD still N>0.";
  }
  if (result.verdict === "push-blind") {
    return "Tally push-blind. Commits already on the remote. Dialog still chalks birth.";
  }
  if (result.verdict === "origin-zero") {
    return "Tally origin-zero. origin/main..HEAD is 0. Dialog still warns loss.";
  }
  if (result.verdict === "base-frozen") {
    return "Tally base-frozen. CLAUDE_BASE stuck at worktree birth.";
  }
  if (result.verdict === "chalked") {
    return "Tally chalked. The /exit slate notched age, not risk.";
  }
  if (result.verdict === "birth-counted") {
    return "Tally birth-counted. N is CLAUDE_BASE..HEAD, not unmerged work.";
  }
  return "Tally refuse. A birth-counted tally is not a hold.";
}

export async function handle(payload = {}, env = process.env) {
  const result = decide(payload);
  const sinks = await fire(result, env);
  const deny = shouldDeny(result);
  return {
    hook_event_name: "UserPromptSubmit",
    permissionDecision: deny ? "deny" : "allow",
    hookSpecificOutput: {
      hookEventName: "UserPromptSubmit",
      permissionDecision: deny ? "deny" : "allow",
      decision: {
        behavior: deny ? "deny" : "allow",
        message: deny
          ? denyMessage(result)
          : "Tally squared. HEAD matches CLAUDE_BASE. Birth count 0. Idle word is squared.",
        interrupt: deny,
      },
    },
    ...result,
    sinks: sinks.events,
  };
}

function send(res, status, body) {
  const json = JSON.stringify(body);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "content-type,authorization",
  });
  res.end(json);
}

export function listen(port = 9090) {
  const server = createServer(async (req, res) => {
    if (req.method === "OPTIONS") {
      send(res, 204, { ok: true });
      return;
    }
    if (req.method === "GET" && (req.url === "/" || req.url === "/health")) {
      send(res, 200, {
        ok: true,
        product: "tally",
        hook: "UserPromptSubmit",
        verbs: "squared|birth-counted|false-loss|merged-still-n|push-blind|base-frozen|remount-grew|origin-zero|chalked|keep-or-lose",
      });
      return;
    }
    if (req.method !== "POST") {
      send(res, 405, { ok: false, error: "POST a tally action { action, tally? }." });
      return;
    }
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const raw = Buffer.concat(chunks).toString("utf8").trim();
    let payload = {};
    try {
      payload = raw ? parsePayload(raw) : {};
    } catch {
      send(res, 400, { ok: false, error: "JSON body required." });
      return;
    }
    const out = await handle(payload);
    send(res, 200, out);
  });
  server.listen(port, "127.0.0.1", () => {
    process.stderr.write(`tally hook listening on http://127.0.0.1:${port}\n`);
  });
  return server;
}

const asCli = Boolean(process.argv[1]) && import.meta.url === pathToFileURL(process.argv[1]).href;
if (asCli) {
  const listenFlag = process.argv.includes("--listen");
  if (listenFlag) {
    const port = Number(process.argv[process.argv.indexOf("--listen") + 1] || 9090);
    listen(Number.isFinite(port) ? port : 9090);
  } else {
    const fileArg = process.argv.slice(2).find((arg) => !arg.startsWith("--"));
    let payload;
    if (fileArg) {
      payload = parsePayload(readFileSync(fileArg, "utf8"));
    } else {
      payload = await readStdin();
    }
    const out = await handle(payload);
    process.stdout.write(`${JSON.stringify(out)}\n`);
  }
}
