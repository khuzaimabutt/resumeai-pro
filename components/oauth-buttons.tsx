"use client";

import { useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

export default function OAuthButtons({ next = "/dashboard" }: { next?: string }) {
  const [loading, setLoading] = useState<"google" | "linkedin" | null>(null);

  async function signInWith(provider: "google" | "linkedin_oidc") {
    setLoading(provider === "linkedin_oidc" ? "linkedin" : "google");
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });
      if (error) throw error;
    } catch (e: any) {
      toast.error(e?.message ?? "Sign-in failed", {
        description: "If this provider isn't set up yet, please use email/password.",
      });
      setLoading(null);
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => signInWith("google")}
        disabled={loading !== null}
        className="flex w-full items-center justify-center gap-3 rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/10 active:scale-[0.99] disabled:opacity-50"
      >
        <GoogleIcon />
        {loading === "google" ? "Connecting..." : "Continue with Google"}
      </button>
      <button
        type="button"
        onClick={() => signInWith("linkedin_oidc")}
        disabled={loading !== null}
        className="flex w-full items-center justify-center gap-3 rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/10 active:scale-[0.99] disabled:opacity-50"
      >
        <LinkedInIcon />
        {loading === "linkedin" ? "Connecting..." : "Continue with LinkedIn"}
      </button>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.56c2.08-1.92 3.28-4.74 3.28-8.1Z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.77c-.99.66-2.25 1.06-3.72 1.06-2.86 0-5.29-1.93-6.15-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
      <path fill="#FBBC05" d="M5.85 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.43.35-2.1V7.07H2.18a11 11 0 0 0 0 9.86l3.67-2.84Z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.07.56 4.21 1.65l3.15-3.15C17.45 2.1 14.97 1 12 1A11 11 0 0 0 2.18 7.07l3.67 2.84C6.71 7.31 9.14 5.38 12 5.38Z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="#0A66C2" aria-hidden="true">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14ZM8 17V10H5.5v7H8Zm-1.25-8.06a1.45 1.45 0 1 0 0-2.9 1.45 1.45 0 0 0 0 2.9ZM18.5 17v-3.85c0-2-1.07-2.93-2.5-2.93-1.15 0-1.66.63-1.95 1.07V10H11.6c.03.7 0 7 0 7h2.45v-3.91c0-.22.02-.44.08-.6.18-.44.58-.9 1.26-.9.89 0 1.24.68 1.24 1.67V17h2.45Z"/>
    </svg>
  );
}
