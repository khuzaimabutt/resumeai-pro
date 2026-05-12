import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  const { data: resumes } = await supabase.from("resumes").select("*").eq("user_id", user.id);
  const { data: payments } = await supabase.from("payments").select("*").eq("user_id", user.id);

  const payload = {
    exported_at: new Date().toISOString(),
    user: { id: user.id, email: user.email },
    profile,
    resumes: resumes ?? [],
    payments: payments ?? [],
  };

  return new NextResponse(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="resumeai-export-${user.id}.json"`,
    },
  });
}
