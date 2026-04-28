"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { UserType } from "@/lib/types";

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="text-white/60">Loading...</div>}>
      <SignupInner />
    </Suspense>
  );
}

function SignupInner() {
  const router = useRouter();
  const params = useSearchParams();
  const initialType = (params.get("type") as UserType) || "fresher";

  const [step, setStep] = useState<1 | 2>(1);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [userType, setUserType] = useState<UserType>(initialType);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== confirm) { setError("Passwords don't match"); return; }
    if (password.length < 6) { setError("Password must be 6+ characters"); return; }
    setStep(2);
  }

  async function finishSignup() {
    setLoading(true); setError(null);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email, password,
        options: { data: { full_name: fullName } },
      });
      if (error) throw error;
      // Save user_type into profile (the trigger creates the row)
      if (data.user) {
        await supabase.from("profiles")
          .update({ user_type: userType, full_name: fullName })
          .eq("id", data.user.id);
      }
      router.push("/dashboard");
    } catch (e: any) {
      setError(e.message ?? "Signup failed");
      setStep(1);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full">
      <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm text-white/70 hover:text-white">← Back</Link>

      <div className="glass rounded-2xl p-8">
        {step === 1 ? (
          <>
            <h1 className="font-display text-2xl font-bold">Create your account</h1>
            <p className="mt-1 text-sm text-white/60">Free forever — no credit card required.</p>

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <Field label="Full name">
                <input className="input text-slate-900" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </Field>
              <Field label="Email">
                <input type="email" className="input text-slate-900" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </Field>
              <Field label="Password">
                <input type="password" className="input text-slate-900" required value={password} onChange={(e) => setPassword(e.target.value)} />
              </Field>
              <Field label="Confirm password">
                <input type="password" className="input text-slate-900" required value={confirm} onChange={(e) => setConfirm(e.target.value)} />
              </Field>
              {error && <div className="rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-200">{error}</div>}
              <button className="btn-primary w-full" type="submit">Continue →</button>
            </form>
          </>
        ) : (
          <>
            <h1 className="font-display text-2xl font-bold">Tell us about you</h1>
            <p className="mt-1 text-sm text-white/60">We'll tailor everything to your level.</p>

            <div className="mt-6 space-y-3">
              {(["fresher", "intermediate", "professional"] as UserType[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setUserType(t)}
                  className={`w-full rounded-xl border p-4 text-left transition ${
                    userType === t ? "border-brand bg-brand/10" : "border-white/10 hover:bg-white/5"
                  }`}
                >
                  <div className="font-display font-semibold capitalize">
                    {t === "fresher" ? "🎓 Fresh Graduate" : t === "intermediate" ? "💼 Working Professional" : "👑 Senior Executive"}
                  </div>
                  <div className="text-xs text-white/60">
                    {t === "fresher" && "Student or graduate, 0 experience"}
                    {t === "intermediate" && "1–5 years, switching jobs"}
                    {t === "professional" && "5+ years, senior roles"}
                  </div>
                </button>
              ))}
            </div>

            {error && <div className="mt-4 rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-200">{error}</div>}

            <div className="mt-6 flex gap-3">
              <button onClick={() => setStep(1)} className="btn-ghost flex-1" disabled={loading}>Back</button>
              <button onClick={finishSignup} className="btn-primary flex-1" disabled={loading}>
                {loading ? "Creating account..." : "Create account"}
              </button>
            </div>
          </>
        )}

        <div className="mt-6 text-center text-sm text-white/60">
          Already have an account? <Link href="/login" className="text-brand hover:underline">Sign in</Link>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-white/70">{label}</label>
      {children}
    </div>
  );
}
