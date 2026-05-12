"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { formatDate, scoreColor } from "@/lib/utils";

type Resume = {
  id: string;
  title: string;
  target_role: string | null;
  user_type: string;
  status: string;
  ats_score: number | null;
  created_at: string;
};

export default function ResumeCard({ resume, onChange }: { resume: Resume; onChange: () => void }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  async function rename() {
    const newTitle = prompt("Rename resume:", resume.title);
    if (!newTitle || newTitle === resume.title) return;
    setBusy(true);
    const res = await fetch(`/api/resumes/${resume.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle }),
    });
    setBusy(false);
    if (res.ok) { toast.success("Renamed"); onChange(); }
    else toast.error("Could not rename");
  }

  async function duplicate() {
    setBusy(true); setMenuOpen(false);
    const res = await fetch(`/api/resumes/${resume.id}/duplicate`, { method: "POST" });
    const data = await res.json();
    setBusy(false);
    if (res.ok) { toast.success("Duplicated"); router.push(`/builder/${data.id}`); }
    else toast.error(data.error ?? "Could not duplicate");
  }

  async function remove() {
    if (!confirm(`Delete "${resume.title}"? This can't be undone.`)) return;
    setBusy(true); setMenuOpen(false);
    const res = await fetch(`/api/resumes/${resume.id}`, { method: "DELETE" });
    setBusy(false);
    if (res.ok) { toast.success("Deleted"); onChange(); }
    else toast.error("Could not delete");
  }

  function downloadPdf() {
    setMenuOpen(false);
    window.open(`/api/resumes/${resume.id}/pdf`, "_blank");
  }

  return (
    <div className={`card relative card-hover ${busy ? "opacity-60" : ""}`}>
      <Link href={`/preview/${resume.id}`} className="block">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs capitalize text-slate-700">{resume.user_type}</span>
          <span className={`rounded-full border px-2 py-0.5 text-xs ${
            resume.status === "generated" ? "border-green-200 bg-green-50 text-green-700" :
            resume.status === "draft" ? "border-slate-200 bg-slate-50 text-slate-600" :
            resume.status === "generating" ? "border-blue-200 bg-blue-50 text-blue-700" :
            "border-red-200 bg-red-50 text-red-700"
          }`}>{resume.status}</span>
        </div>

        {/* mini paper preview */}
        <div className="mb-3 aspect-[8.5/11] rounded-md border border-slate-200 bg-white p-3 shadow-inner overflow-hidden">
          <div className="space-y-1.5">
            <div className="h-2 w-3/5 rounded bg-slate-800/80" />
            <div className="h-1.5 w-2/5 rounded bg-brand/70" />
            <div className="mt-2 h-px w-full bg-slate-200" />
            <div className="mt-2 h-1.5 w-1/4 rounded bg-brand/40" />
            <div className="h-1 w-full rounded bg-slate-200" />
            <div className="h-1 w-11/12 rounded bg-slate-200" />
            <div className="h-1 w-9/12 rounded bg-slate-200" />
            <div className="mt-2 h-1.5 w-1/3 rounded bg-brand/40" />
            <div className="h-1 w-full rounded bg-slate-200" />
            <div className="h-1 w-10/12 rounded bg-slate-200" />
            <div className="h-1 w-8/12 rounded bg-slate-200" />
            <div className="mt-2 flex flex-wrap gap-1">
              {[1,2,3,4,5].map((i) => <span key={i} className="h-1.5 w-6 rounded-sm bg-slate-200" />)}
            </div>
          </div>
        </div>

        <h3 className="font-display text-lg font-semibold leading-tight line-clamp-1">{resume.title}</h3>
        <p className="text-sm text-slate-500 line-clamp-1">{resume.target_role || "—"}</p>
        <div className="mt-4 flex items-center justify-between">
          {resume.ats_score != null ? (
            <span className={`rounded-md border px-2 py-0.5 text-xs font-medium ${scoreColor(resume.ats_score)}`}>
              ATS {resume.ats_score}/100
            </span>
          ) : <span className="text-xs text-slate-400">Not generated yet</span>}
          <span className="text-xs text-slate-400">{formatDate(resume.created_at)}</span>
        </div>
      </Link>

      {/* Overflow menu */}
      <div ref={menuRef} className="absolute right-3 top-3">
        <button
          onClick={(e) => { e.preventDefault(); setMenuOpen((v) => !v); }}
          className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          aria-label="More actions"
        >
          <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor"><path d="M10 6a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm0 5.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm0 5.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z"/></svg>
        </button>
        {menuOpen && (
          <div className="absolute right-0 top-9 z-10 w-44 rounded-lg border border-slate-200 bg-white p-1 shadow-lg">
            <MenuItem onClick={() => { setMenuOpen(false); router.push(`/builder/${resume.id}`); }}>✎ Edit</MenuItem>
            <MenuItem onClick={rename}>✎ Rename</MenuItem>
            <MenuItem onClick={duplicate}>⎘ Duplicate</MenuItem>
            {resume.status === "generated" && <MenuItem onClick={downloadPdf}>↓ Download PDF</MenuItem>}
            <div className="my-1 h-px bg-slate-100" />
            <MenuItem onClick={remove} danger>🗑 Delete</MenuItem>
          </div>
        )}
      </div>
    </div>
  );
}

function MenuItem({ children, onClick, danger }: { children: React.ReactNode; onClick: () => void; danger?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center rounded px-3 py-1.5 text-left text-sm transition ${danger ? "text-red-600 hover:bg-red-50" : "text-slate-700 hover:bg-slate-50"}`}
    >
      {children}
    </button>
  );
}
