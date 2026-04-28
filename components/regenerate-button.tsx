"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegenerateButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  return (
    <button
      onClick={async () => {
        if (!confirm("Regenerate? This uses 1 credit.")) return;
        setLoading(true);
        const res = await fetch(`/api/resumes/${id}/generate`, { method: "POST" });
        const data = await res.json();
        setLoading(false);
        if (!res.ok) return alert(data.error || "Failed");
        router.refresh();
      }}
      className="btn-secondary w-full"
      disabled={loading}
    >
      {loading ? "Regenerating..." : "↻ Regenerate"}
    </button>
  );
}
