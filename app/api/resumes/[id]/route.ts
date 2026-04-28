import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data, error } = await supabase.from("resumes").select("*").eq("id", params.id).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json(data);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const body = await req.json();
  const allowed: Record<string, any> = {};
  for (const k of ["title", "target_role", "user_type", "content"]) {
    if (body[k] !== undefined) allowed[k] = body[k];
  }
  const { error } = await supabase.from("resumes").update(allowed).eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const { error } = await supabase.from("resumes").update({ is_deleted: true }).eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
