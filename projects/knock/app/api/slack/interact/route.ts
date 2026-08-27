import { NextResponse } from "next/server";
import { parseSlackInteraction } from "@/lib/adapters/slack";
import { decideKnock } from "@/lib/engine";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.text();
  const parsed = parseSlackInteraction(body);
  if (!parsed) {
    return NextResponse.json({ error: "unrecognized Slack payload" }, { status: 400 });
  }
  const result = await decideKnock(parsed.knockId, parsed.decision, parsed.actor);
  if (!result.ok) {
    return NextResponse.json({ text: result.error });
  }
  return NextResponse.json({
    text: `Knock ${result.knock.status}: ${result.knock.toolName} for ${result.knock.runId}.`,
  });
}
