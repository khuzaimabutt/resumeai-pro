"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import ResumeCard from "@/components/resume-card";
import NewResumeButton from "@/components/new-resume-button";
import type { UserType } from "@/lib/types";

type Resume = {
  id: string;
  title: string;
  target_role: string | null;
  user_type: string;
  status: string;
  ats_score: number | null;
  created_at: string;
};

export default function DashboardResumes({
  resumes,
  userType,
}: { resumes: Resume[]; userType: UserType }) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | "draft" | "generated">("all");
  const [sort, setSort] = useState<"recent" | "score" | "title">("recent");

  function refresh() {
    startTransition(() => router.refresh());
  }

  const filtered = useMemo(() => {
    let xs = resumes.slice();
    if (q) {
      const ql = q.toLowerCase();
      xs = xs.filter((r) => r.title.toLowerCase().includes(ql) || (r.target_role ?? "").toLowerCase().includes(ql));
    }
    if (filter !== "all") xs = xs.filter((r) => r.status === filter);
    if (sort === "score") xs.sort((a, b) => (b.ats_score ?? -1) - (a.ats_score ?? -1));
    else if (sort === "title") xs.sort((a, b) => a.title.localeCompare(b.title));
    else xs.sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
    return xs;
  }, [resumes, q, filter, sort]);

  return (
    <section>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-xl font-semibold">My Resumes</h2>
        <div className="text-xs text-slate-500">{filtered.length} of {resumes.length}</div>
      </div>

      {resumes.length > 0 && (
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[180px]">
            <input
              className="input pl-9"
              placeholder="Search title or role..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" width="16" height="16" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 3.359 9.842l3.4 3.4a.75.75 0 1 0 1.06-1.06l-3.4-3.4A5.5 5.5 0 0 0 9 3.5ZM5.5 9a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0Z" clipRule="evenodd"/></svg>
          </div>
          <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>All</FilterChip>
          <FilterChip active={filter === "draft"} onClick={() => setFilter("draft")}>Drafts</FilterChip>
          <FilterChip active={filter === "generated"} onClick={() => setFilter("generated")}>Generated</FilterChip>
          <select className="input max-w-[150px]" value={sort} onChange={(e) => setSort(e.target.value as any)}>
            <option value="recent">Most recent</option>
            <option value="score">Highest ATS</option>
            <option value="title">Title A-Z</option>
          </select>
        </div>
      )}

      {(!resumes || resumes.length === 0) ? (
        <div className="card flex flex-col items-center py-16 text-center">
          <div className="mb-4 text-5xl">📄</div>
          <h3 className="font-display text-xl font-semibold">No resumes yet</h3>
          <p className="mt-1 text-sm text-slate-500">Create your first resume to get started.</p>
          <NewResumeButton userType={userType} className="mt-6" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card py-12 text-center text-sm text-slate-500">No matches. Try clearing search or filters.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {filtered.map((r) => (
            <ResumeCard key={r.id} resume={r} onChange={refresh} />
          ))}
        </div>
      )}
    </section>
  );
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
        active ? "bg-brand text-white" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
      }`}
    >
      {children}
    </button>
  );
}
