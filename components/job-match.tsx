"use client";

import { useState } from "react";
import { toast } from "sonner";

type Result = {
  match_score: number;
  matched_count: number;
  total_keywords: number;
  missing_keywords: string[];
};

export default function JobMatch({ resumeId }: { resumeId: string }) {
  const [open, setOpen] = useState(false);
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  async function run() {
    if (jd.trim().length < 50) { toast.error("Paste a longer job description"); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/resumes/${resumeId}/job-match`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ job_description: jd }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Match failed");
      setResult(data);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }

  const score = result?.match_score ?? 0;
  const tone = score >= 70 ? "text-green-600" : score >= 50 ? "text-amber-600" : "text-red-600";

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-display text-base font-semibold">Job match</div>
          <p className="text-xs text-slate-500">See how well this resume fits a specific posting.</p>
        </div>
        <button onClick={() => setOpen((v) => !v)} className="btn-secondary">
          {open ? "Hide" : "🎯 Match"}
        </button>
      </div>

      {open && (
        <div className="mt-4 space-y-3 border-t border-slate-100 pt-4">
          <div>
            <label className="label">Paste the job description</label>
            <textarea
              className="input min-h-[140px] resize-y thin-scroll"
              placeholder="Paste the full job description here…"
              value={jd}
              onChange={(e) => setJd(e.target.value)}
            />
            <div className="mt-1 text-[11px] text-slate-400">{jd.length} chars · paste 50+ for accurate match</div>
          </div>
          <button onClick={run} disabled={loading} className="btn-primary w-full">
            {loading ? "Analyzing…" : "Run match"}
          </button>

          {result && (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-baseline gap-2">
                <span className={`font-display text-3xl font-bold ${tone}`}>{score}%</span>
                <span className="text-xs text-slate-500">match</span>
                <span className="ml-auto text-xs text-slate-500">
                  {result.matched_count}/{result.total_keywords} keywords
                </span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                <div className={`h-full transition-all ${score >= 70 ? "bg-green-500" : score >= 50 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${score}%` }} />
              </div>

              {result.missing_keywords.length > 0 && (
                <div className="mt-4">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Missing keywords</div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {result.missing_keywords.map((k) => (
                      <span key={k} className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-800">{k}</span>
                    ))}
                  </div>
                  <p className="mt-3 text-xs text-slate-500">
                    Tip: weave these naturally into your bullets and skills — don't keyword-stuff.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
