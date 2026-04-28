import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import BuilderForm from "@/components/builder-form";

export const dynamic = "force-dynamic";

export default async function BuilderPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: resume } = await supabase
    .from("resumes")
    .select("*")
    .eq("id", params.id)
    .single();
  if (!resume) notFound();

  const { data: profile } = await supabase
    .from("profiles")
    .select("credits_remaining, full_name, email")
    .eq("id", user.id)
    .single();

  return (
    <BuilderForm
      resume={resume}
      profile={profile ?? { credits_remaining: 0, full_name: "", email: user.email ?? "" }}
    />
  );
}
