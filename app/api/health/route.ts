import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    time: new Date().toISOString(),
    version: "0.2.0",
    features: {
      ai_mock: process.env.MOCK_AI === "true",
      payments_mock: process.env.MOCK_PAYMENTS === "true",
    },
  });
}
