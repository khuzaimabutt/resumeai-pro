import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { mockGenerate, calculateAtsScore } from "@/lib/ai/mock";
import type { UserType, ResumeContent } from "@/lib/types";

export const maxDuration = 30;

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles").select("credits_remaining").eq("id", user.id).single();
  if (!profile || profile.credits_remaining <= 0) {
    return NextResponse.json({ error: "Out of credits. Please upgrade your plan." }, { status: 402 });
  }

  const { data: resume, error: rErr } = await supabase
    .from("resumes").select("*").eq("id", params.id).single();
  if (rErr || !resume) return NextResponse.json({ error: "Resume not found" }, { status: 404 });

  await supabase.from("resumes").update({ status: "generating" }).eq("id", params.id);

  try {
    const generated = await mockGenerate(
      resume.content as ResumeContent,
      resume.user_type as UserType,
      resume.target_role ?? "the role"
    );
    const { score, tips } = calculateAtsScore(
      resume.content as ResumeContent,
      generated,
      resume.target_role ?? ""
    );

    await supabase.from("resumes").update({
      status: "generated",
      generated,
      ats_score: score,
      improvement_tips: tips,
    }).eq("id", params.id);

    await supabase.from("profiles")
      .update({ credits_remaining: profile.credits_remaining - 1 })
      .eq("id", user.id);

    // Mock email log
    await supabase.from("email_logs").insert({
      to_email: user.email!,
      subject: `Your Resume is Ready — ATS Score: ${score}/100`,
      body: `Hi, your resume has been generated successfully. ATS Score: ${score}/100. Tips: ${tips.join(" / ")}`,
    });

    return NextResponse.json({ ok: true, ats_score: score });
  } catch (e: any) {
    await supabase.from("resumes").update({ status: "failed" }).eq("id", params.id);
    return NextResponse.json({ error: e.message ?? "AI generation failed" }, { status: 500 });
  }
}
