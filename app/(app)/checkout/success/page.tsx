import Link from "next/link";

export default function CheckoutSuccess({ searchParams }: { searchParams: { plan?: string } }) {
  return (
    <div className="card mx-auto max-w-lg text-center">
      <div className="mb-4 text-5xl">✅</div>
      <h1 className="font-display text-2xl font-bold">Payment received (mock)</h1>
      <p className="mt-2 text-slate-600">
        Your <strong className="capitalize">{(searchParams.plan ?? "").replace("_", " ")}</strong> credits have been added to your account.
      </p>
      <p className="mt-3 text-xs text-slate-400">
        This is a stubbed payment. To enable real Stripe, set <code>MOCK_PAYMENTS=false</code> and add your Stripe keys.
      </p>
      <Link href="/dashboard" className="btn-primary mt-6 inline-flex">Back to dashboard</Link>
    </div>
  );
}
