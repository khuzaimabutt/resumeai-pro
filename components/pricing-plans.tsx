"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Plan = "fresher_pack" | "pro_monthly" | "professional_pack";

const PLANS: Array<{ key: Plan; name: string; price: string; sub?: string; features: string[]; highlight?: boolean; badge?: string }> = [
  { key: "fresher_pack", name: "Fresher Pack", price: "$5", sub: "one-time", features: ["3 resumes", "All templates", "PDF export", "Cover letters"], badge: "For Students" },
  { key: "pro_monthly", name: "Pro Monthly", price: "$12", sub: "/ month", features: ["20 credits / mo", "Job matcher", "Priority AI", "Unlimited templates"], highlight: true, badge: "Most Popular" },
  { key: "professional_pack", name: "Professional", price: "$25", sub: "one-time", features: ["5 executive resumes", "Priority AI", "Executive template", "Cover letters"] },
];

export default function PricingPlans() {
  const router = useRouter();
  const [loading, setLoading] = useState<Plan | null>(null);

  async function buy(plan: Plan) {
    setLoading(plan);
    const res = await fetch("/api/payments/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    const data = await res.json();
    setLoading(null);
    if (!res.ok) return alert(data.error || "Checkout failed");
    if (data.mock_url) {
      router.push(data.mock_url);
    }
  }

  return (
    <div className="grid gap-5 md:grid-cols-3">
      {PLANS.map((p) => (
        <div key={p.key} className={`relative rounded-2xl border p-6 ${p.highlight ? "border-brand bg-brand/5" : "border-slate-200 bg-white"}`}>
          {p.badge && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gold px-3 py-0.5 text-xs font-semibold text-navy">{p.badge}</div>
          )}
          <div className="font-display text-lg font-semibold">{p.name}</div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-3xl font-bold">{p.price}</span>
            {p.sub && <span className="text-sm text-slate-500">{p.sub}</span>}
          </div>
          <ul className="mt-5 space-y-2 text-sm text-slate-700">
            {p.features.map((f) => <li key={f}>✓ {f}</li>)}
          </ul>
          <button onClick={() => buy(p.key)} disabled={loading === p.key} className={`mt-6 w-full ${p.highlight ? "btn-primary" : "btn-secondary"}`}>
            {loading === p.key ? "Processing..." : "Buy"}
          </button>
        </div>
      ))}
    </div>
  );
}
