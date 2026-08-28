/**
 * Husk adapters — stdin JSON / CLI for orchestrators.
 * Pipe `claude -p ... --output-format json` (or stream-json NDJSON) into husk.
 * Treat husked (and every hollow class) as failure even when Claude exited 0.
 */
import { FAIL_CLOSED, score } from "./husk.mjs";

export function parseStdin(raw) {
  const text = raw == null ? "" : String(raw);
  return text.trim();
}

export function exitCode(result) {
  if (!result || result.verdict === "kernel") return 0;
  if (FAIL_CLOSED.includes(result.verdict)) return 1;
  return 1;
}

export function formatScore(result) {
  return `${JSON.stringify(result)}\n`;
}

export function scoreRaw(raw, extra = {}) {
  const text = parseStdin(raw);
  if (!text) return score({ ...extra });
  return score({ rawText: text, ...tryWrap(text, extra) });
}

function tryWrap(text, extra) {
  const trimmed = text.trim();
  if (!trimmed) return extra;
  try {
    const parsed = JSON.parse(trimmed);
    if (parsed && typeof parsed === "object") {
      if (Array.isArray(parsed)) return { stream: parsed, ...extra };
      return { ...parsed, ...extra };
    }
  } catch {
    return { rawText: trimmed, stream: trimmed, ...extra };
  }
  return { rawText: trimmed, ...extra };
}

export function handle(input, extra = {}) {
  if (typeof input === "string") return scoreRaw(input, extra);
  return score({ ...input, ...extra });
}
