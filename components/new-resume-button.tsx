"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import type { UserType } from "@/lib/types";

export default function NewResumeButton({
  userType,
  className,
}: { userType: UserType; className?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function create() {
    setLoading(true);
    try {
      const res = await fetch("/api/resumes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_type: userType }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      router.push(`/builder/${data.id}`);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button onClick={create} disabled={loading} className={`btn-primary ${className ?? ""}`}>
      {loading ? "Creating..." : "+ New Resume"}
    </button>
  );
}
