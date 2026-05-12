import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { mockRewriteBullet } from "@/lib/ai/mock";
import type { UserType } from "@/lib/types";

export const maxDuration = 15;

export async function POST(req: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const original: string = body.original ?? "";
  const userType: UserType = body.user_type ?? "intermediate";
  const targetRole: string = body.target_role ?? "";

  if (!original.trim()) {
    return NextResponse.json({ error: "Bullet text required" }, { status: 400 });
  }
  if (original.length > 500) {
    return NextResponse.json({ error: "Bullet too long" }, { status: 400 });
  }

  const result = await mockRewriteBullet(original, userType, { targetRole });
  return NextResponse.json(result);
}
