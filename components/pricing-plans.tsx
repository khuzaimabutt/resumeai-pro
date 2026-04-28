"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Plan = "free" | "fresher_pack" | "pro_monthly" | "professional_pack";
type Billing = "monthly" | "annual";

const PLANS: Array<{ key: Plan; name: string; priceMonthly: string; priceAnnual: string; sub?: string; features: string[]; highlight?: boolean; badge?: string; oneTime?: boolean }> = [
  {
    key: "free",
    name: "Free",
    priceMonthly: "$0",
    priceAnnual: "$0",
    features: ["1 resume", "Basic template", "PDF export", "Limited AI rewrites"],
  },
  {
    key: "fresher_pack",
    name: "Fresher Pack",
    priceMonthly: "$5",
    priceAnnual: "$5",
    sub: "one-time",
    features: ["3 resumes", "All templates", "PDF + DOCX export", "Cover letters", "Priority email support"],
    badge: "For Students",
    oneTime: true,
  },
  {
    key: "pro_monthly",
    name: "Pro Monthly",
    priceMonthly: "$12",
    priceAnnual: "$115",
    sub: "/ month",
    features: ["20 credits / month", "Unlimited templates", "Job matcher", "Priority AI", "All export formats", "Resume version history"],
    highlight: true,
    badge: "Most Popular",
  },
  {
    key: "professional_pack",
    name: "Professional",
    priceMonthly: "$25",
    priceAnnual: "$25",
    sub: "one-time",
    features: ["5 executive resumes", "Priority AI", "Executive template", "Cover letters", "LinkedIn rewrite"],
    oneTime: true,
  },
];

export default function PricingPlans({ currentPlan = "free" as Plan }: { currentPlan?: Plan }) {
  const router = useRouter();
  const [loading, setLoading] = useState<Plan | null>(null);
  const [billing, setBilling] = useState<Billing>("monthly");

  async function buy(plan: Plan) {
    if (plan === "free") return;
    setLoading(plan);
    try {
      const res = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Checkout failed");
      if (data.mock_url) router.push(data.mock_url);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="mx-auto flex w-fit items-center gap-1 rounded-full border border-slate-200 bg-white p-1">
        {(["monthly", "annual"] as Billing[]).map((b) => (
          <button
            key={b}
            onClick={() => setBilling(b)}
            className={`rounded-full px-4 py-1.5 text-xs font-medium capitalize transition ${
              billing === b ? "bg-brand text-white" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {b}
            {b === "annual" && <span className="ml-1.5 rounded-full bg-green-500 px-1.5 py-0.5 text-[10px] text-white">Save 20%</span>}
          </button>
        ))}
      </div>

      <div className="grid items-end gap-5 md:grid-cols-4">
        {PLANS.map((p) => {
          const isCurrent = p.key === currentPlan;
          const price = p.oneTime ? p.priceMonthly : (billing === "annual" ? p.priceAnnual : p.priceMonthly);
          const sub = p.oneTime ? p.sub : (billing === "annual" ? "/ year" : p.sub);
          return (
            <div
              key={p.key}
              className={`relative rounded-2xl border bg-white p-6 transition ${
                p.highlight
                  ? "border-brand shadow-2xl shadow-brand/10 md:scale-105 md:py-8"
                  : "border-slate-200"
              }`}
            >
              {p.badge && (
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-0.5 text-xs font-semibold ${p.highlight ? "bg-gradient-to-r from-brand to-brand/80 text-white" : "bg-gold text-navy"}`}>{p.badge}</div>
              )}
              {isCurrent && (
                <div className="absolute right-3 top-3 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700">
                  ✓ Active
                </div>
              )}
              <div className="font-display text-lg font-semibold">{p.name}</div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-bold">{price}</span>
                {sub && <span className="text-sm text-slate-500">{sub}</span>}
              </div>
              <ul className="mt-5 space-y-2 text-sm text-slate-700">
                {p.features.map((f) => <li key={f} className="flex gap-2"><span className="text-green-500">✓</span> {f}</li>)}
              </ul>
              <button
                onClick={() => buy(p.key)}
                disabled={loading === p.key || isCurrent || p.key === "free"}
                className={`mt-6 w-full ${p.highlight ? "btn-primary" : "btn-secondary"} disabled:opacity-50`}
              >
                {isCurrent ? "Current plan" : p.key === "free" ? "Free forever" : loading === p.key ? "Processing..." : "Buy"}
              </button>
            </div>
          );
        })}
      </div>

      {/* Comparison strip */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Feature</th>
              {PLANS.map((p) => <th key={p.key} className="px-4 py-3 text-center font-semibold text-slate-600">{p.name}</th>)}
            </tr>
          </thead>
          <tbody>
            {[
              { label: "Number of resumes", values: ["1", "3", "Unlimited", "5"] },
              { label: "Templates", values: ["1", "All", "All", "All"] },
              { label: "PDF export", values: ["✓", "✓", "✓", "✓"] },
              { label: "DOCX export", values: ["—", "✓", "✓", "✓"] },
              { label: "AI bullet rewrites", values: ["Limited", "Unlimited", "Unlimited", "Unlimited"] },
              { label: "Job matcher", values: ["—", "—", "✓", "—"] },
              { label: "Priority AI", values: ["—", "—", "✓", "✓"] },
              { label: "Cover letters", values: ["—", "✓", "✓", "✓"] },
              { label: "Version history", values: ["—", "—", "✓", "—"] },
            ].map((row, i) => (
              <tr key={i} className="border-b border-slate-100 last:border-b-0">
                <td className="px-4 py-3 text-slate-700">{row.label}</td>
                {row.values.map((v, j) => (
                  <td key={j} className="px-4 py-3 text-center text-slate-600">
                    {v === "✓" ? <span className="text-green-500 font-bold">✓</span> : v === "—" ? <span className="text-slate-300">—</span> : v}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-center text-xs text-slate-500">All plans include 7-day refund · Secure cloud storage · Cancel anytime</p>
    </div>
  );
}
