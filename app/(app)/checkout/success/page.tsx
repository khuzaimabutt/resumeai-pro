import Link from "next/link";

export default function CheckoutSuccess({ searchParams }: { searchParams: { plan?: string } }) {
  const plan = (searchParams.plan ?? "").replace("_", " ");
  return (
    <div className="mx-auto max-w-2xl">
      <div className="card text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-500 text-3xl text-white shadow-lg float-up">
          ✓
        </div>
        <h1 className="font-display text-3xl font-bold">Payment received</h1>
        <p className="mt-2 text-slate-600">
          Your <strong className="capitalize">{plan}</strong> credits have been added to your account.
        </p>

        <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-5 text-left">
          <div className="text-xs font-semibold uppercase tracking-widest text-slate-500">What's next</div>
          <ol className="mt-3 space-y-3 text-sm text-slate-700">
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/15 text-xs font-bold text-brand">1</span>
              <div>
                <div className="font-medium">Create your next resume</div>
                <div className="text-slate-500">Tailored to a specific role gets you the best ATS score.</div>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/15 text-xs font-bold text-brand">2</span>
              <div>
                <div className="font-medium">Try the new templates</div>
                <div className="text-slate-500">Switch templates from the preview page in one click.</div>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/15 text-xs font-bold text-brand">3</span>
              <div>
                <div className="font-medium">Use AI bullet rewriter</div>
                <div className="text-slate-500">Click ✨ next to any bullet for a stronger version.</div>
              </div>
            </li>
          </ol>
        </div>

        <div className="mt-8 flex justify-center gap-3">
          <Link href="/dashboard" className="btn-primary">Back to dashboard</Link>
          <Link href="/pricing" className="btn-secondary">View invoice</Link>
        </div>

        <p className="mt-6 text-[11px] text-slate-400">
          Receipt sent to your email. Need a refund? <a href="#" className="underline hover:text-slate-600">Contact support</a> within 7 days.
        </p>
      </div>
    </div>
  );
}
