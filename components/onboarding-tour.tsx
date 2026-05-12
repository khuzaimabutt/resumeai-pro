"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "ra:onboarding-v1";

const STEPS = [
  {
    title: "Welcome to ResumeAI Pro 👋",
    body: "Let's get you set up. We tailor everything to your career stage — fresher, intermediate, or senior.",
  },
  {
    title: "Step 1 — Create a resume",
    body: "Click + New Resume. We'll create a draft tailored to your career stage so you can start filling.",
  },
  {
    title: "Step 2 — Use the ✨ AI Improver",
    body: "Inside the builder, click the ✨ button next to any bullet point — we'll rewrite it with action verbs and metrics.",
  },
  {
    title: "Step 3 — Generate & Download",
    body: "Hit Generate to get an ATS-scored resume. Try the 4 templates, then download as PDF, DOCX, or plain text.",
  },
];

export default function OnboardingTour({ shouldShow }: { shouldShow: boolean }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!shouldShow) return;
    if (typeof window === "undefined") return;
    if (localStorage.getItem(STORAGE_KEY)) return;
    setOpen(true);
  }, [shouldShow]);

  function dismiss() {
    setOpen(false);
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, "1");
  }

  if (!open) return null;
  const s = STEPS[step];
  const last = step === STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl float-up">
        <div className="mb-4 flex items-center gap-1.5">
          {STEPS.map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full ${i <= step ? "bg-brand" : "bg-slate-200"}`} />
          ))}
        </div>
        <h3 className="font-display text-xl font-bold">{s.title}</h3>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">{s.body}</p>
        <div className="mt-6 flex items-center justify-between">
          <button onClick={dismiss} className="text-xs text-slate-500 hover:text-slate-700">Skip tour</button>
          <div className="flex gap-2">
            {step > 0 && <button onClick={() => setStep(step - 1)} className="btn-secondary">Back</button>}
            {!last && <button onClick={() => setStep(step + 1)} className="btn-primary">Next →</button>}
            {last && <button onClick={dismiss} className="btn-primary">Get started</button>}
          </div>
        </div>
      </div>
    </div>
  );
}
