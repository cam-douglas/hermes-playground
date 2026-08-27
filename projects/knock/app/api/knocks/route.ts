import { NextResponse } from "next/server";
import { createKnock, listPublicKnocks } from "@/lib/engine";

export const dynamic = "force-dynamic";

export async function GET() {
  const knocks = await listPublicKnocks();
  return NextResponse.json({ knocks });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const result = await createKnock(body);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }
  return NextResponse.json(result, { status: result.reused ? 200 : 201 });
}
