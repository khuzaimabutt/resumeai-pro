"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function RegenerateButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  return (
    <div className="card">
      <button
        onClick={async () => {
          if (!confirm("Regenerate? This uses 1 credit.")) return;
          setLoading(true);
          const res = await fetch(`/api/resumes/${id}/generate`, { method: "POST" });
          const data = await res.json();
          setLoading(false);
          if (!res.ok) { toast.error(data.error || "Regeneration failed"); return; }
          toast.success("Regenerated");
          router.refresh();
        }}
        className="btn-secondary w-full"
        disabled={loading}
      >
        {loading ? "Regenerating..." : "↻ Regenerate with new AI pass"}
      </button>
      <p className="mt-2 text-[11px] text-slate-500">Uses 1 credit. Your edits stay; only the AI rewrites get refreshed.</p>
    </div>
  );
}
