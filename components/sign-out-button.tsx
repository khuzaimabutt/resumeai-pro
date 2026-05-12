"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

export default function SignOutButton() {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        toast.success("Signed out");
        router.push("/");
        router.refresh();
      }}
      className="flex w-full items-center justify-between rounded px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900"
    >
      <span>Sign out</span>
      <span aria-hidden="true">↗</span>
    </button>
  );
}
