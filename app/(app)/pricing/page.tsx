import { createClient } from "@/lib/supabase/server";
import PricingPlans from "@/components/pricing-plans";

export const dynamic = "force-dynamic";

export default async function PricingPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = user
    ? await supabase.from("profiles").select("plan").eq("id", user.id).single()
    : { data: null };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="text-xs uppercase tracking-widest text-brand">Pricing</div>
        <h1 className="mt-2 font-display text-4xl font-bold">Pick the plan that fits your career stage</h1>
        <p className="mt-3 text-slate-600">Start free. Upgrade when you need unlimited resumes, premium templates, and priority AI.</p>
      </div>
      <PricingPlans currentPlan={(profile?.plan as any) ?? "free"} />
    </div>
  );
}
