import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { scoreColor } from "@/lib/utils";
import ResumeRenderer from "@/components/resume-renderer";
import RegenerateButton from "@/components/regenerate-button";
import type { GeneratedResume } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function PreviewPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: resume } = await supabase.from("resumes").select("*").eq("id", params.id).single();
  if (!resume) notFound();

  if (!resume.generated) {
    return (
      <div className="card text-center">
        <h2 className="font-display text-xl font-semibold">This resume hasn't been generated yet.</h2>
        <p className="mt-1 text-slate-500">Open the builder to fill it in and run AI generation.</p>
        <Link href={`/builder/${resume.id}`} className="btn-primary mt-6 inline-flex">Go to builder</Link>
      </div>
    );
  }

  const generated = resume.generated as GeneratedResume;
  const tips = (resume.improvement_tips as string[] | null) ?? [];

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="card overflow-hidden p-0">
        <ResumeRenderer
          generated={generated}
          fullName={(resume.content as any)?.personal?.full_name ?? "Your Name"}
          contact={(resume.content as any)?.personal ?? {}}
          targetRole={resume.target_role ?? ""}
        />
      </div>

      <aside className="space-y-4">
        <div className="card">
          <div className="text-xs uppercase tracking-wider text-slate-500">ATS Score</div>
          <div className={`mt-3 inline-flex h-24 w-24 items-center justify-center rounded-full border-4 text-2xl font-bold ${scoreColor(resume.ats_score ?? 0)}`}>
            {resume.ats_score ?? 0}
          </div>
          <div className="mt-3 text-sm text-slate-500">out of 100</div>

          {tips.length > 0 && (
            <>
              <div className="mt-5 text-xs font-semibold uppercase tracking-wider text-slate-500">Improvement tips</div>
              <ul className="mt-2 space-y-1.5 text-sm text-slate-700">
                {tips.map((t, i) => <li key={i}>· {t}</li>)}
              </ul>
            </>
          )}
        </div>

        <div className="card space-y-2">
          <a href={`/api/resumes/${resume.id}/pdf`} className="btn-primary w-full" target="_blank" rel="noopener">
            ↓ Download PDF
          </a>
          <Link href={`/builder/${resume.id}`} className="btn-secondary w-full">Edit resume</Link>
          <RegenerateButton id={resume.id} />
        </div>
      </aside>
    </div>
  );
}
