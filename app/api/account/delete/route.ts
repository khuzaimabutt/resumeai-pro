import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

export async function POST() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Soft delete user's resumes
  await supabase.from("resumes").update({ is_deleted: true }).eq("user_id", user.id);

  // Hard delete the auth user using service-role key (admin API)
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supaUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (serviceKey && supaUrl) {
    const admin = createServiceClient(supaUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    await admin.auth.admin.deleteUser(user.id);
  }

  await supabase.auth.signOut();
  return NextResponse.json({ ok: true });
}
