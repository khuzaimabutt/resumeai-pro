import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDate, scoreColor } from "@/lib/utils";
import NewResumeButton from "@/components/new-resume-button";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user!.id)
    .single();
  const { data: resumes } = await supabase
    .from("resumes")
    .select("id, title, target_role, user_type, status, ats_score, created_at")
    .eq("is_deleted", false)
    .order("created_at", { ascending: false });

  const totalResumes = resumes?.length ?? 0;
  const avgAts = resumes?.length
    ? Math.round(resumes.reduce((s, r) => s + (r.ats_score ?? 0), 0) / resumes.filter((r) => r.ats_score).length || 0)
    : 0;

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="font-display text-3xl font-bold">
            Welcome back, {profile?.full_name?.split(" ")[0] || "there"}
            <span className="ml-3 inline-block rounded-full bg-brand/10 px-3 py-1 text-sm font-medium text-brand capitalize">
              {profile?.user_type}
            </span>
          </h1>
          <p className="mt-1 text-slate-600">Let's build something that gets you hired.</p>
        </div>
        <NewResumeButton userType={profile?.user_type ?? "fresher"} />
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Stat label="Resumes Created" value={totalResumes} />
        <Stat label="Avg ATS Score" value={avgAts || "—"} />
        <Stat label="Credits Remaining" value={profile?.credits_remaining ?? 0} />
        <Stat label="Plan" value={(profile?.plan ?? "free").replace("_", " ")} capitalize />
      </div>

      {/* Resumes */}
      <section>
        <h2 className="mb-4 font-display text-xl font-semibold">My Resumes</h2>
        {(!resumes || resumes.length === 0) ? (
          <div className="card flex flex-col items-center py-16 text-center">
            <div className="mb-4 text-5xl">📄</div>
            <h3 className="font-display text-xl font-semibold">No resumes yet</h3>
            <p className="mt-1 text-sm text-slate-500">Create your first resume to get started.</p>
            <NewResumeButton userType={profile?.user_type ?? "fresher"} className="mt-6" />
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {resumes.map((r) => (
              <Link key={r.id} href={`/preview/${r.id}`} className="card transition hover:shadow-md">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs capitalize text-slate-700">{r.user_type}</span>
                  <span className={`rounded-full border px-2 py-0.5 text-xs ${
                    r.status === "generated" ? "border-green-200 bg-green-50 text-green-700" :
                    r.status === "draft" ? "border-slate-200 bg-slate-50 text-slate-600" :
                    r.status === "generating" ? "border-blue-200 bg-blue-50 text-blue-700" :
                    "border-red-200 bg-red-50 text-red-700"
                  }`}>{r.status}</span>
                </div>
                <h3 className="font-display text-lg font-semibold">{r.title}</h3>
                <p className="text-sm text-slate-500">{r.target_role || "—"}</p>
                <div className="mt-4 flex items-center justify-between">
                  {r.ats_score != null ? (
                    <span className={`rounded-md border px-2 py-0.5 text-xs font-medium ${scoreColor(r.ats_score)}`}>
                      ATS {r.ats_score}/100
                    </span>
                  ) : <span className="text-xs text-slate-400">Not generated yet</span>}
                  <span className="text-xs text-slate-400">{formatDate(r.created_at)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value, capitalize }: { label: string; value: string | number; capitalize?: boolean }) {
  return (
    <div className="card">
      <div className="text-xs uppercase tracking-wider text-slate-500">{label}</div>
      <div className={`mt-2 font-display text-2xl font-bold ${capitalize ? "capitalize" : ""}`}>{value}</div>
    </div>
  );
}
