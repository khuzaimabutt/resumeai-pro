import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-navy bg-hero-mesh text-white">
      <div className="mx-auto grid min-h-screen max-w-6xl px-6 py-8 lg:grid-cols-2 lg:gap-10 lg:px-10">
        {/* Marketing rail */}
        <div className="hidden flex-col justify-between lg:flex">
          <Link href="/" className="flex items-center gap-2 font-display text-xl font-bold">
            <span className="inline-block h-7 w-7 rounded-md bg-gradient-to-br from-brand to-gold" />
            ResumeAI <span className="text-gold">Pro</span>
          </Link>

          <div className="space-y-8">
            <div>
              <h2 className="font-display text-3xl font-bold leading-tight">
                Build a resume that <span className="bg-gradient-to-r from-brand to-gold bg-clip-text text-transparent">gets you hired</span>.
              </h2>
              <p className="mt-3 text-white/60">
                Join 12,400+ job seekers building ATS-optimized resumes in 60 seconds.
              </p>
            </div>

            <div className="space-y-4">
              <Bullet>Real-time ATS score with categorized improvement tips</Bullet>
              <Bullet>One-click AI rewrites for every bullet point</Bullet>
              <Bullet>Export to PDF, DOCX, or plain text</Bullet>
              <Bullet>Tailored layouts for fresher, intermediate, executive</Bullet>
            </div>

            <div className="glass rounded-2xl p-5">
              <div className="flex gap-1 text-gold">
                {"★★★★★".split("").map((s, j) => <span key={j}>{s}</span>)}
              </div>
              <p className="mt-2 text-sm text-white/80">
                "Got 3 interviews in my first week. The ATS score feature alone is worth it."
              </p>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-orange-500 text-xs font-bold">PS</div>
                <div>
                  <div className="text-sm font-semibold">Priya Sharma</div>
                  <div className="text-xs text-white/50">Software Engineer · Stripe</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 text-xs text-white/40">
            <span>© {new Date().getFullYear()} ResumeAI Pro</span>
            <a href="/" className="hover:text-white/70 transition">Privacy</a>
            <a href="/" className="hover:text-white/70 transition">Terms</a>
          </div>
        </div>

        {/* Form area */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand to-gold text-xs font-bold">✓</span>
      <span className="text-sm text-white/80">{children}</span>
    </div>
  );
}
