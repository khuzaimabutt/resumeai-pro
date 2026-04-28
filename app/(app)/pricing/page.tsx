import PricingPlans from "@/components/pricing-plans";

export default function PricingPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="font-display text-3xl font-bold">Pricing</h1>
        <p className="mt-2 text-slate-600">Pick the plan that fits your career stage.</p>
      </div>
      <PricingPlans />
    </div>
  );
}
