import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { UserType } from "@/lib/types";

export async function POST(req: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const userType: UserType = body.user_type ?? "fresher";

  const { data, error } = await supabase
    .from("resumes")
    .insert({
      user_id: user.id,
      title: "Untitled Resume",
      user_type: userType,
      status: "draft",
      content: {},
    })
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ id: data.id });
}

export async function GET() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data } = await supabase
    .from("resumes")
    .select("id, title, target_role, user_type, status, ats_score, created_at")
    .eq("is_deleted", false)
    .order("created_at", { ascending: false });

  return NextResponse.json({ resumes: data ?? [] });
}
