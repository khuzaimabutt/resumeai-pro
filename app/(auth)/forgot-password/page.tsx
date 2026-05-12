"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setSent(true);
      toast.success("Check your inbox for the reset link.");
    } catch (e: any) {
      toast.error(e?.message ?? "Could not send reset email");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full">
      <Link href="/login" className="mb-6 inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition">← Back to sign in</Link>
      <div className="glass rounded-2xl p-8">
        <h1 className="font-display text-2xl font-bold">Reset your password</h1>
        <p className="mt-1 text-sm text-white/60">Enter your email and we'll send you a link.</p>

        {sent ? (
          <div className="mt-6 rounded-md border border-green-400/30 bg-green-500/10 px-4 py-3 text-sm text-green-200">
            ✓ Email sent. Check your inbox (and spam) for the reset link.
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-white/70">Email</label>
              <input type="email" className="input text-slate-900" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <button className="btn-primary w-full" type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send reset link"}
            </button>
          </form>
        )}

        <div className="mt-6 text-center text-sm text-white/60">
          Remembered? <Link href="/login" className="text-brand hover:underline">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
