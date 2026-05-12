import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import NewResumeButton from "@/components/new-resume-button";
import DashboardResumes from "@/components/dashboard-resumes";
import OnboardingTour from "@/components/onboarding-tour";

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

  const list = resumes ?? [];
  const totalResumes = list.length;
  const scored = list.filter((r) => r.ats_score != null);
  const avgAts = scored.length
    ? Math.round(scored.reduce((s, r) => s + (r.ats_score ?? 0), 0) / scored.length)
    : 0;
  const lastDraft = list.find((r) => r.status === "draft");
  const recentlyGenerated = list.find((r) => r.status === "generated");
  const continueResume = lastDraft ?? recentlyGenerated;

  return (
    <div className="space-y-8">
      <OnboardingTour shouldShow={list.length === 0} />

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

      {/* Continue card */}
      {continueResume && (
        <div className="card flex flex-col items-start gap-3 border-brand/30 bg-gradient-to-br from-brand/5 to-transparent md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-xs uppercase tracking-widest text-brand">{lastDraft ? "Continue where you left off" : "Most recent"}</div>
            <div className="mt-1 font-display text-lg font-semibold">{continueResume.title}</div>
            <div className="text-sm text-slate-500">{continueResume.target_role || "No target role yet"}</div>
          </div>
          <Link
            href={lastDraft ? `/builder/${continueResume.id}` : `/preview/${continueResume.id}`}
            className="btn-primary"
          >
            {lastDraft ? "Resume editing" : "Open resume"} →
          </Link>
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Stat label="Resumes Created" value={totalResumes} />
        <Stat label="Avg ATS Score" value={avgAts || "—"} />
        <Stat label="Credits Remaining" value={profile?.credits_remaining ?? 0} />
        <Stat label="Plan" value={(profile?.plan ?? "free").replace("_", " ")} capitalize />
      </div>

      {(profile?.plan ?? "free") === "free" && (
        <div className="rounded-xl border border-gold/30 bg-gradient-to-r from-gold/10 via-brand/5 to-transparent p-4 text-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="font-semibold">You're on the Free plan</div>
              <div className="text-slate-600">Upgrade for unlimited resumes, all templates, and priority AI.</div>
            </div>
            <Link href="/pricing" className="btn-primary shrink-0">See plans</Link>
          </div>
        </div>
      )}

      <DashboardResumes resumes={list} userType={profile?.user_type ?? "fresher"} />
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
