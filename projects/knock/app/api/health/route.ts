import { NextResponse } from "next/server";
import { statusPayload } from "@/lib/engine";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({ ok: true, ...statusPayload() });
}
