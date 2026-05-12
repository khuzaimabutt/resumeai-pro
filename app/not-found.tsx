import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-navy bg-hero-mesh text-white">
      <div className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-6 text-center">
        <div className="mb-6 inline-block rounded-2xl bg-gradient-to-br from-brand to-gold p-1 shadow-2xl">
          <div className="rounded-2xl bg-navy px-8 py-5">
            <div className="font-display text-7xl font-extrabold tracking-tight bg-gradient-to-r from-brand to-gold bg-clip-text text-transparent">404</div>
          </div>
        </div>
        <h1 className="font-display text-3xl font-bold">Page not found</h1>
        <p className="mt-2 text-white/60">The page you're looking for doesn't exist or has moved.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-primary">Back home</Link>
          <Link href="/dashboard" className="btn-ghost">Go to dashboard</Link>
        </div>
      </div>
    </div>
  );
}
