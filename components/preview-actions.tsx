"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { TEMPLATES, type Template } from "@/components/resume-renderer";

export default function PreviewActions({ id, defaultTemplate }: { id: string; defaultTemplate: Template }) {
  const [tpl, setTpl] = useState<Template>(defaultTemplate);

  function setTemplate(next: Template) {
    setTpl(next);
    const u = new URL(window.location.href);
    u.searchParams.set("tpl", next);
    window.history.replaceState({}, "", u.toString());
    window.location.reload();
  }

  function shareLink() {
    const url = `${window.location.origin}/preview/${id}`;
    navigator.clipboard.writeText(url).then(
      () => toast.success("Link copied to clipboard"),
      () => toast.error("Could not copy link"),
    );
  }

  return (
    <div className="space-y-4">
      <div className="card">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Template</div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => setTemplate(t.id)}
              className={`rounded-lg border p-3 text-left transition ${tpl === t.id ? "border-brand bg-brand/5 ring-1 ring-brand/30" : "border-slate-200 hover:border-slate-300"}`}
            >
              <div className="text-sm font-semibold">{t.name}</div>
              <div className="text-[11px] text-slate-500">{t.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="card space-y-2">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Download</div>
        <a href={`/api/resumes/${id}/pdf`} className="btn-primary w-full" target="_blank" rel="noopener">↓ PDF (recommended)</a>
        <a href={`/api/resumes/${id}/docx`} className="btn-secondary w-full">↓ DOCX (editable)</a>
        <a href={`/api/resumes/${id}/txt`} className="btn-secondary w-full">↓ Plain text (ATS-safe)</a>
      </div>

      <div className="card space-y-2">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</div>
        <Link href={`/builder/${id}`} className="btn-secondary w-full">✎ Edit</Link>
        <button onClick={shareLink} className="btn-secondary w-full">🔗 Copy share link</button>
        <button onClick={() => window.print()} className="btn-secondary w-full">🖨 Print</button>
      </div>
    </div>
  );
}
