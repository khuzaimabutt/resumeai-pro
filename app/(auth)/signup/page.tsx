"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import type { UserType } from "@/lib/types";
import OAuthButtons from "@/components/oauth-buttons";
import PasswordStrength, { passwordScore } from "@/components/password-strength";

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="text-white/60">Loading...</div>}>
      <SignupInner />
    </Suspense>
  );
}

const TYPE_LABELS: Record<UserType, { emoji: string; title: string; desc: string }> = {
  fresher: { emoji: "🎓", title: "Fresh Graduate", desc: "Student or graduate, 0 experience" },
  intermediate: { emoji: "💼", title: "Working Professional", desc: "1–5 years, switching jobs" },
  professional: { emoji: "👑", title: "Senior Executive", desc: "5+ years, senior roles" },
};

function SignupInner() {
  const router = useRouter();
  const params = useSearchParams();
  const initialType = (params.get("type") as UserType) || "fresher";

  const [step, setStep] = useState<1 | 2>(1);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [userType, setUserType] = useState<UserType>(initialType);
  const [loading, setLoading] = useState(false);

  function onContinue(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) { toast.error("Passwords don't match"); return; }
    const { score } = passwordScore(password);
    if (score < 2) { toast.error("Password too weak", { description: "Use at least 8 chars with mix of cases and numbers." }); return; }
    setStep(2);
  }

  async function finishSignup() {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email, password,
        options: { data: { full_name: fullName, user_type: userType } },
      });
      if (error) throw error;
      if (data.user) {
        await supabase.from("profiles")
          .update({ user_type: userType, full_name: fullName })
          .eq("id", data.user.id);
      }
      toast.success("Account created!");
      router.push("/dashboard");
    } catch (e: any) {
      toast.error(e?.message ?? "Signup failed");
      setStep(1);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full">
      <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition">← Back</Link>

      <div className="glass rounded-2xl p-8">
        {/* Step indicator */}
        <div className="mb-6 flex items-center gap-2 text-xs">
          <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold ${step >= 1 ? "bg-brand text-white" : "bg-white/10 text-white/50"}`}>1</span>
          <span className={`text-[11px] uppercase tracking-widest ${step >= 1 ? "text-white" : "text-white/40"}`}>Account</span>
          <div className={`h-px flex-1 ${step >= 2 ? "bg-brand" : "bg-white/10"}`} />
          <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold ${step >= 2 ? "bg-brand text-white" : "bg-white/10 text-white/50"}`}>2</span>
          <span className={`text-[11px] uppercase tracking-widest ${step >= 2 ? "text-white" : "text-white/40"}`}>Level</span>
        </div>

        {step === 1 ? (
          <>
            <h1 className="font-display text-2xl font-bold">Create your account</h1>
            <p className="mt-1 text-sm text-white/60">Free forever — no credit card required.</p>

            <div className="mt-6">
              <OAuthButtons next="/dashboard" />
            </div>

            <div className="my-5 flex items-center gap-3 text-[11px] uppercase tracking-widest text-white/40">
              <div className="h-px flex-1 bg-white/10" />
              or with email
              <div className="h-px flex-1 bg-white/10" />
            </div>

            <form onSubmit={onContinue} className="space-y-4">
              <Field label="Full name">
                <input className="input text-slate-900" required value={fullName} onChange={(e) => setFullName(e.target.value)} autoComplete="name" />
              </Field>
              <Field label="Email">
                <input type="email" className="input text-slate-900" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
              </Field>
              <Field label="Password">
                <div className="relative">
                  <input type={showPwd ? "text" : "password"} className="input pr-10 text-slate-900" required value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
                  <button type="button" onClick={() => setShowPwd((v) => !v)} className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-700">
                    {showPwd ? "Hide" : "Show"}
                  </button>
                </div>
                <PasswordStrength password={password} />
              </Field>
              <Field label="Confirm password">
                <input type={showPwd ? "text" : "password"} className="input text-slate-900" required value={confirm} onChange={(e) => setConfirm(e.target.value)} />
              </Field>
              <button className="btn-primary w-full" type="submit">Continue →</button>
            </form>
          </>
        ) : (
          <>
            <h1 className="font-display text-2xl font-bold">Tell us about you</h1>
            <p className="mt-1 text-sm text-white/60">We'll tailor everything to your level.</p>

            <div className="mt-6 space-y-3">
              {(["fresher", "intermediate", "professional"] as UserType[]).map((t) => {
                const meta = TYPE_LABELS[t];
                const selected = userType === t;
                return (
                  <button
                    key={t}
                    onClick={() => setUserType(t)}
                    className={`flex w-full gap-4 rounded-xl border p-4 text-left transition ${
                      selected ? "border-brand bg-brand/15 ring-1 ring-brand" : "border-white/10 hover:bg-white/5"
                    }`}
                  >
                    <div className="text-3xl">{meta.emoji}</div>
                    <div className="flex-1">
                      <div className="font-display font-semibold">{meta.title}</div>
                      <div className="text-xs text-white/60">{meta.desc}</div>
                    </div>
                    <div className={`mt-1 h-5 w-5 shrink-0 rounded-full border-2 transition ${selected ? "border-brand bg-brand" : "border-white/20"}`}>
                      {selected && <span className="block text-center text-[11px] leading-4 text-white">✓</span>}
                    </div>
                  </button>
                );
              })}
            </div>

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

      <p className="mt-6 text-center text-xs text-white/40">
        By signing up you agree to our <a href="#" className="underline hover:text-white/70">Terms</a> and <a href="#" className="underline hover:text-white/70">Privacy Policy</a>.
      </p>
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
