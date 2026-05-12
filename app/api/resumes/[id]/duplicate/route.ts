import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: original } = await supabase
    .from("resumes")
    .select("*")
    .eq("id", params.id)
    .single();
  if (!original) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { data, error } = await supabase
    .from("resumes")
    .insert({
      user_id: user.id,
      title: `${original.title} (Copy)`,
      user_type: original.user_type,
      target_role: original.target_role,
      status: original.status,
      content: original.content,
      generated: original.generated,
      ats_score: original.ats_score,
      improvement_tips: original.improvement_tips,
    })
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ id: data.id });
}
