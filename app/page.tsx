import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-navy text-white">
      {/* Nav */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-navy/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 font-display text-xl font-bold">
            <span className="inline-block h-7 w-7 rounded-md bg-gradient-to-br from-brand to-gold" />
            ResumeAI <span className="text-gold">Pro</span>
          </Link>
          <nav className="hidden gap-6 text-sm text-white/80 md:flex">
            <a href="#how">How it works</a>
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
          </nav>
          <div className="flex gap-2">
            <Link href="/login" className="btn-ghost">Sign in</Link>
            <Link href="/signup" className="btn-primary">Start free</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-hero-mesh">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-20 md:grid-cols-2 md:py-28">
          <div className="fade-in">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/80">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" /> Powered by AI · ATS-Optimized
            </span>
            <h1 className="font-display text-4xl font-extrabold leading-tight md:text-6xl">
              Build a Resume That <span className="bg-gradient-to-r from-brand to-gold bg-clip-text text-transparent">Gets You Hired</span> — In 60 Seconds
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/70">
              AI-powered resume builder tailored to your experience level. Fresher, intermediate, or professional — we speak your language.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/signup" className="btn-primary">Build my resume free →</Link>
              <a href="#examples" className="btn-ghost">See examples</a>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-3 text-xs text-white/60">
              <Badge>ATS Optimized</Badge>
              <Badge>AI Powered</Badge>
              <Badge>PDF Export</Badge>
              <Badge>3 User Levels</Badge>
            </div>
          </div>

          <MockResumePreview />
        </div>
      </section>

      {/* User types */}
      <section id="how" className="mx-auto max-w-6xl px-6 py-20">
        <SectionHeader eyebrow="Who is this for" title="Built for Every Stage of Your Career" />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <UserTypeCard
            emoji="🎓"
            title="Fresh Graduate"
            desc="No experience? No problem. We turn your projects, education, and skills into a resume that gets interviews."
            bullets={["Projects-first layout", "Skills highlighting", "Education focus", "Entry-level language"]}
            href="/signup?type=fresher"
            cta="Start as Fresher"
          />
          <UserTypeCard
            emoji="💼"
            title="Working Professional"
            desc="1-5 years in? Let AI rewrite your experience with powerful action verbs and quantified achievements."
            bullets={["Experience-focused layout", "Achievement rewriting", "Career progression", "Mid-level positioning"]}
            href="/signup?type=intermediate"
            cta="Start as Intermediate"
            highlight
          />
          <UserTypeCard
            emoji="👑"
            title="Senior Executive"
            desc="5+ years of leadership? Get an executive-grade resume that showcases your impact, not your responsibilities."
            bullets={["Executive summary", "Metrics & impact focus", "Leadership highlighting", "C-suite language"]}
            href="/signup?type=professional"
            cta="Start as Professional"
          />
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeader eyebrow="How it works" title="Three Steps to Your Perfect Resume" />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <Step n={1} title="Choose Your Level" body="Select fresher, intermediate, or professional." />
            <Step n={2} title="Fill Your Details" body="A smart form that adapts to your experience level." />
            <Step n={3} title="AI Does the Magic" body="Get a polished, ATS-ready resume in seconds." />
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-6 py-20">
        <SectionHeader eyebrow="Features" title="Everything You Need, Nothing You Don't" />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          <Feature title="ATS Score Checker" body="Know if your resume will pass automated screening." />
          <Feature title="Smart AI Rewriting" body="Powerful action verbs and quantified achievements." />
          <Feature title="3 Layouts Per Level" body="Templates that match your seniority." />
          <Feature title="PDF Export" body="Download a perfectly formatted PDF instantly." />
          <Feature title="Multiple Versions" body="Create different resumes for different jobs." />
          <Feature title="Privacy First" body="Your data stays yours — encrypted at rest." />
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeader eyebrow="Pricing" title="Simple, Transparent Pricing" />
          <div className="mt-12 grid gap-5 md:grid-cols-4">
            <PricingCard plan="Free" price="$0" features={["1 resume", "Basic template", "PDF export"]} cta="Start free" href="/signup" />
            <PricingCard plan="Fresher Pack" price="$5" sub="one-time" features={["3 resumes", "All templates", "Cover letters"]} badge="For Students" cta="Buy" href="/signup" />
            <PricingCard plan="Pro Monthly" price="$12" sub="/ month" features={["Unlimited resumes", "Job matcher", "Priority AI"]} badge="Most Popular" highlight cta="Go Pro" href="/signup" />
            <PricingCard plan="Professional" price="$25" sub="one-time" features={["5 executive resumes", "Priority AI", "All templates"]} cta="Buy" href="/signup" />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl px-6 py-20">
        <SectionHeader eyebrow="FAQ" title="Frequently Asked Questions" />
        <div className="mt-10 space-y-3">
          <FaqItem q="Is my data private and secure?" a="Yes. All data is stored encrypted at rest, behind row-level security in Supabase." />
          <FaqItem q="Will my resume pass ATS systems?" a="Yes — we generate clean, single-column layouts with standard headers and keyword-rich content." />
          <FaqItem q="Can I edit the AI-generated resume?" a="Of course. After generation you can fully edit, regenerate, or duplicate any section." />
          <FaqItem q="How many resumes can I create?" a="Free plan: 1 resume. Paid plans: 3, 5, or unlimited." />
          <FaqItem q="What formats can I download?" a="High-quality PDF — print-ready and ATS-friendly." />
          <FaqItem q="Do you offer refunds?" a="Yes — 7-day no-questions refund on all paid plans." />
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-br from-brand/40 to-gold/20 py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-display text-4xl font-bold">Ready to Land Your Dream Job?</h2>
          <p className="mt-4 text-white/80">No credit card required. Build your first resume in 60 seconds.</p>
          <Link href="/signup" className="btn-primary mt-8 inline-flex">Start Building Free →</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-10 text-sm text-white/60">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 md:flex-row">
          <div>© {new Date().getFullYear()} ResumeAI Pro</div>
          <div className="flex gap-5">
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1">{children}</span>;
}

function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="text-center">
      <div className="text-xs uppercase tracking-widest text-gold">{eyebrow}</div>
      <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">{title}</h2>
    </div>
  );
}

function UserTypeCard({
  emoji, title, desc, bullets, href, cta, highlight,
}: { emoji: string; title: string; desc: string; bullets: string[]; href: string; cta: string; highlight?: boolean }) {
  return (
    <div className={`glass rounded-2xl p-6 ${highlight ? "ring-2 ring-brand" : ""}`}>
      <div className="mb-4 text-3xl">{emoji}</div>
      <h3 className="font-display text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-white/70">{desc}</p>
      <ul className="mt-4 space-y-1.5 text-sm text-white/80">
        {bullets.map((b) => <li key={b}>· {b}</li>)}
      </ul>
      <Link href={href} className="btn-primary mt-6 w-full">{cta}</Link>
    </div>
  );
}

function Step({ n, title, body }: { n: number; title: string; body: string }) {
  return (
    <div className="glass rounded-2xl p-6">
      <div className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand text-sm font-bold">{n}</div>
      <h3 className="font-display text-lg font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-white/70">{body}</p>
    </div>
  );
}

function Feature({ title, body }: { title: string; body: string }) {
  return (
    <div className="glass rounded-xl p-5">
      <h3 className="font-display font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-white/70">{body}</p>
    </div>
  );
}

function PricingCard({
  plan, price, sub, features, badge, highlight, cta, href,
}: { plan: string; price: string; sub?: string; features: string[]; badge?: string; highlight?: boolean; cta: string; href: string }) {
  return (
    <div className={`relative rounded-2xl border p-6 ${highlight ? "border-brand bg-brand/10" : "border-white/10 bg-white/[0.02]"}`}>
      {badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gold px-3 py-0.5 text-xs font-semibold text-navy">{badge}</div>
      )}
      <div className="font-display text-lg font-semibold">{plan}</div>
      <div className="mt-2 flex items-baseline gap-1">
        <span className="text-3xl font-bold">{price}</span>
        {sub && <span className="text-sm text-white/60">{sub}</span>}
      </div>
      <ul className="mt-5 space-y-2 text-sm text-white/80">
        {features.map((f) => <li key={f}>✓ {f}</li>)}
      </ul>
      <Link href={href} className={`mt-6 block w-full ${highlight ? "btn-primary" : "btn-ghost"}`}>{cta}</Link>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="glass rounded-xl px-5 py-4">
      <summary className="cursor-pointer list-none font-medium">{q}</summary>
      <p className="mt-2 text-sm text-white/70">{a}</p>
    </details>
  );
}

function MockResumePreview() {
  return (
    <div className="fade-in relative">
      <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-brand/30 to-gold/20 blur-2xl" />
      <div className="relative rounded-2xl bg-white p-6 text-slate-800 shadow-2xl">
        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <div className="font-display text-lg font-bold">Alex Morgan</div>
            <div className="text-xs text-slate-500">Software Engineer</div>
          </div>
          <div className="text-right text-xs text-slate-500">
            <div>alex@example.com</div>
            <div>San Francisco, CA</div>
          </div>
        </div>
        <div className="mt-3 text-[11px] uppercase tracking-widest text-brand">Summary</div>
        <p className="mt-1 text-xs text-slate-700">
          Results-focused software engineer with 4+ years shipping production-grade systems. Proven record of translating ambiguous requirements into reliable platforms.
        </p>
        <div className="mt-3 text-[11px] uppercase tracking-widest text-brand">Experience</div>
        <div className="mt-1 text-xs">
          <div className="font-semibold">Senior Engineer · Acme Corp</div>
          <div className="text-slate-500">2021 – Present</div>
          <ul className="mt-1 list-disc pl-4 text-slate-700">
            <li>Led migration to Kubernetes, improving uptime to 99.9%.</li>
            <li>Reduced API latency by 42% across 5 services.</li>
          </ul>
        </div>
        <div className="mt-3 text-[11px] uppercase tracking-widest text-brand">Skills</div>
        <div className="mt-1 flex flex-wrap gap-1 text-[11px]">
          {["TypeScript", "React", "Next.js", "PostgreSQL", "AWS"].map((s) => (
            <span key={s} className="rounded bg-slate-100 px-2 py-0.5 text-slate-700">{s}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
