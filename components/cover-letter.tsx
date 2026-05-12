"use client";

import { useState } from "react";
import { toast } from "sonner";

type Tone = "formal" | "warm" | "confident";

export default function CoverLetter({ resumeId, defaultRole }: { resumeId: string; defaultRole?: string }) {
  const [open, setOpen] = useState(false);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState(defaultRole ?? "");
  const [tone, setTone] = useState<Tone>("warm");
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");

  async function generate() {
    if (!company.trim()) { toast.error("Please enter a company name"); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/resumes/${resumeId}/cover-letter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company, role, tone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not generate");
      setText(data.text);
      toast.success("Cover letter ready ✨");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }

  function copy() {
    navigator.clipboard.writeText(text).then(() => toast.success("Copied to clipboard"));
  }

  function download() {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cover-letter-${company.replace(/\s+/g, "_")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-display text-base font-semibold">Cover letter</div>
          <p className="text-xs text-slate-500">AI-generate a tailored letter for this resume.</p>
        </div>
        <button onClick={() => setOpen((v) => !v)} className="btn-secondary">
          {open ? "Hide" : "✨ Generate"}
        </button>
      </div>

      {open && (
        <div className="mt-4 space-y-3 border-t border-slate-100 pt-4">
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="label">Company</label>
              <input className="input" placeholder="e.g. Stripe" value={company} onChange={(e) => setCompany(e.target.value)} />
            </div>
            <div>
              <label className="label">Role (optional)</label>
              <input className="input" placeholder="e.g. Senior Backend Engineer" value={role} onChange={(e) => setRole(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="label">Tone</label>
            <div className="flex gap-2">
              {(["formal", "warm", "confident"] as Tone[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  className={`rounded-full px-3 py-1 text-xs capitalize transition ${tone === t ? "bg-brand text-white" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <button onClick={generate} disabled={loading} className="btn-primary w-full">
            {loading ? "Writing your letter…" : "Generate cover letter"}
          </button>

          {text && (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-slate-800">{text}</pre>
              <div className="mt-3 flex gap-2">
                <button onClick={copy} className="btn-secondary flex-1">Copy</button>
                <button onClick={download} className="btn-secondary flex-1">↓ Download .txt</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
