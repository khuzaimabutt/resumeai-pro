import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen text-white">
      {/* Fixed colorful wallpaper — stays in place while content scrolls over it */}
      <div className="fixed inset-0 -z-10 bg-navy bg-hero-mesh" aria-hidden="true" />

      <Nav />
      <Hero />
      <TrustedBy />
      <UserTypes />
      <AiDemo />
      <HowItWorks />
      <Features />
      <Testimonials />
      <Pricing />
      <Faq />
      <FinalCta />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-navy/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 font-display text-xl font-bold">
          <span className="inline-block h-7 w-7 rounded-md bg-gradient-to-br from-brand to-gold" />
          ResumeAI <span className="text-gold">Pro</span>
        </Link>
        <nav className="hidden gap-6 text-sm text-white/80 md:flex">
          <a href="#how" className="hover:text-white transition">How it works</a>
          <a href="#features" className="hover:text-white transition">Features</a>
          <a href="#pricing" className="hover:text-white transition">Pricing</a>
          <a href="#faq" className="hover:text-white transition">FAQ</a>
        </nav>
        <div className="flex gap-2">
          <Link href="/login" className="btn-ghost">Sign in</Link>
          <Link href="/signup" className="btn-primary">Start free</Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-20 md:grid-cols-2 md:py-28">
        <div className="fade-in">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/80">
            <span className="h-1.5 w-1.5 rounded-full bg-gold pulse-soft" /> Powered by AI · ATS-Optimized
          </span>
          <h1 className="font-display text-4xl font-extrabold leading-tight md:text-6xl lg:text-7xl">
            Build a Resume That{" "}
            <span className="bg-gradient-to-r from-brand to-gold bg-clip-text text-transparent">Gets You Hired</span>{" "}
            — In 60 Seconds
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
            <Badge>PDF + DOCX Export</Badge>
            <Badge>3 User Levels</Badge>
          </div>
          <div className="mt-6 flex items-center gap-3 text-xs text-white/50">
            <div className="flex -space-x-2">
              {["#2563EB","#F59E0B","#10B981","#EC4899"].map((c, i) => (
                <span key={i} className="h-7 w-7 rounded-full ring-2 ring-navy" style={{ background: c }} />
              ))}
            </div>
            <span>Joined by <strong className="text-white/80">12,400+</strong> job seekers this month</span>
          </div>
        </div>

        <MockResumePreview />
      </div>
    </section>
  );
}

function TrustedBy() {
  const logos = ["Google", "Meta", "Stripe", "Airbnb", "Notion", "Vercel", "Linear", "Spotify"];
  return (
    <section className="border-y border-white/5 bg-navy/60 backdrop-blur-sm py-10">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center text-xs uppercase tracking-widest text-white/40">
          Hires landed at
        </div>
        <div className="mt-6 overflow-hidden">
          <div className="marquee">
            {[...logos, ...logos].map((l, i) => (
              <div key={i} className="mx-8 shrink-0 font-display text-2xl font-bold text-white/30 transition hover:text-white/60">
                {l}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function UserTypes() {
  return (
    <section id="how" className="bg-navy/80 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-6 py-20">
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
      </div>
    </section>
  );
}

function AiDemo() {
  return (
    <section className="bg-navy/80 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-6 py-16">
      <SectionHeader eyebrow="See the AI in action" title="From Boring Bullet to Interview-Ready" />
      <div className="mt-12 grid gap-4 md:grid-cols-3">
        <DemoCard
          step={1}
          label="What you write"
          color="from-slate-600/30 to-slate-700/30"
          textColor="text-white/70"
        >
          <p className="font-mono text-sm">
            "Worked on the website redesign. Helped users find what they needed."
          </p>
        </DemoCard>
        <DemoCard
          step={2}
          label="AI rewrites it"
          color="from-brand/30 to-brand/20"
          textColor="text-white"
          accent
        >
          <p className="font-mono text-sm">
            <span className="bg-brand/30 px-1 rounded">Spearheaded</span> redesign of consumer-facing website,{" "}
            <span className="bg-gold/30 px-1 rounded">improving task-completion by 42%</span> across <span className="bg-gold/30 px-1 rounded">10K+ daily users</span>.
          </p>
        </DemoCard>
        <DemoCard
          step={3}
          label="ATS approved"
          color="from-green-500/20 to-emerald-500/10"
          textColor="text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-widest text-green-300">ATS Score</div>
              <div className="font-display text-3xl font-bold text-green-300">92<span className="text-sm text-white/50">/100</span></div>
            </div>
            <div className="text-3xl">✓</div>
          </div>
          <ul className="mt-3 space-y-1 text-xs text-white/70">
            <li>✓ Quantified impact</li>
            <li>✓ Strong action verb</li>
            <li>✓ Role keywords present</li>
          </ul>
        </DemoCard>
      </div>
      </div>
    </section>
  );
}

function DemoCard({ step, label, color, textColor, accent, children }: {
  step: number; label: string; color: string; textColor: string; accent?: boolean; children: React.ReactNode;
}) {
  return (
    <div className={`relative rounded-2xl border border-white/10 bg-gradient-to-br ${color} p-6 ${accent ? "ring-1 ring-brand/40" : ""}`}>
      <div className="mb-3 flex items-center gap-2">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-xs font-bold">{step}</span>
        <span className="text-xs uppercase tracking-widest text-white/50">{label}</span>
      </div>
      <div className={textColor}>{children}</div>
    </div>
  );
}

function HowItWorks() {
  return (
    <section className="bg-navy/80 backdrop-blur-sm py-20">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader eyebrow="How it works" title="Three Steps to Your Perfect Resume" />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <Step n={1} title="Choose Your Level" body="Select fresher, intermediate, or professional." />
          <Step n={2} title="Fill Your Details" body="A smart form that adapts to your experience level." />
          <Step n={3} title="AI Does the Magic" body="Get a polished, ATS-ready resume in seconds." />
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="features" className="bg-navy/80 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-6 py-20">
      <SectionHeader eyebrow="Features" title="Everything You Need, Nothing You Don't" />
      <div className="mt-12 grid gap-5 md:grid-cols-3 md:auto-rows-fr">
        <BentoCard
          className="md:col-span-2"
          icon="🎯"
          title="ATS Score Checker"
          body="Real-time score from 0–100, with categorized improvement tips by severity. Know exactly what's blocking your resume from passing automated screens."
          tag="Critical"
        />
        <BentoCard icon="✨" title="AI Bullet Rewriter" body="One-click rewrites with action verbs and quantified impact." />
        <BentoCard icon="📐" title="Multiple Templates" body="Modern, classic, and executive layouts." />
        <BentoCard icon="📄" title="PDF + DOCX Export" body="Print-ready PDF and editable DOCX formats." />
        <BentoCard icon="🔒" title="Privacy First" body="Encrypted at rest. Your data is yours." />
      </div>
      </div>
    </section>
  );
}

function BentoCard({ icon, title, body, tag, className = "" }: { icon: string; title: string; body: string; tag?: string; className?: string }) {
  return (
    <div className={`glass relative rounded-2xl p-6 transition hover:bg-white/10 ${className}`}>
      {tag && <div className="absolute right-4 top-4 rounded-full bg-gold/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gold">{tag}</div>}
      <div className="mb-3 text-3xl">{icon}</div>
      <h3 className="font-display text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-white/70">{body}</p>
    </div>
  );
}

function Testimonials() {
  const items = [
    {
      name: "Priya Sharma",
      role: "Software Engineer · Stripe",
      avatar: "PS",
      gradient: "from-pink-500 to-orange-500",
      quote: "Got 3 interviews in my first week using ResumeAI Pro. The ATS score feature alone is worth it.",
    },
    {
      name: "Marcus Chen",
      role: "Product Manager · Notion",
      avatar: "MC",
      gradient: "from-blue-500 to-cyan-500",
      quote: "I'd been job hunting for 4 months. Switched to this, landed an offer in 3 weeks. The AI rewrites are uncanny.",
    },
    {
      name: "Sarah Williams",
      role: "VP Engineering · Linear",
      avatar: "SW",
      gradient: "from-purple-500 to-pink-500",
      quote: "The executive summary it generated was better than what my $300/hr resume coach gave me.",
    },
  ];

  return (
    <section className="bg-navy/80 backdrop-blur-sm py-20">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader eyebrow="Testimonials" title="Loved by Job Seekers Worldwide" />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {items.map((t, i) => (
            <div key={i} className="glass rounded-2xl p-6">
              <div className="flex gap-1 text-gold">
                {"★★★★★".split("").map((s, j) => <span key={j}>{s}</span>)}
              </div>
              <p className="mt-3 text-sm text-white/80 leading-relaxed">"{t.quote}"</p>
              <div className="mt-5 flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${t.gradient} text-sm font-bold`}>
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-white/50">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="pricing" className="bg-navy/80 backdrop-blur-sm py-20">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader eyebrow="Pricing" title="Simple, Transparent Pricing" />
        <p className="mt-3 text-center text-sm text-white/60">No credit card required to start. Upgrade anytime.</p>
        <div className="mt-12 grid items-end gap-5 md:grid-cols-4">
          <PricingCard plan="Free" price="$0" features={["1 resume", "Basic template", "PDF export"]} cta="Start free" href="/signup" />
          <PricingCard plan="Fresher Pack" price="$5" sub="one-time" features={["3 resumes", "All templates", "Cover letters"]} badge="For Students" cta="Buy" href="/signup" />
          <PricingCard plan="Pro Monthly" price="$12" sub="/ month" features={["Unlimited resumes", "Job matcher", "Priority AI", "All formats"]} badge="Most Popular" highlight cta="Go Pro" href="/signup" />
          <PricingCard plan="Professional" price="$25" sub="one-time" features={["5 executive resumes", "Priority AI", "All templates"]} cta="Buy" href="/signup" />
        </div>
        <p className="mt-8 text-center text-xs text-white/50">All plans include 7-day refund · ATS-optimized output · Secure cloud storage</p>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section id="faq" className="bg-navy/80 backdrop-blur-sm">
      <div className="mx-auto max-w-3xl px-6 py-20">
      <SectionHeader eyebrow="FAQ" title="Frequently Asked Questions" />
      <div className="mt-10 space-y-3">
        <FaqItem q="Is my data private and secure?" a="Yes. All data is stored encrypted at rest, behind row-level security in Supabase. We never share or sell your information." />
        <FaqItem q="Will my resume pass ATS systems?" a="Yes — we generate clean, single-column layouts with standard headers, ATS-friendly fonts, and keyword-rich content. Most users score 80+ on first generation." />
        <FaqItem q="Can I edit the AI-generated resume?" a="Of course. After generation you can fully edit, regenerate any section, or apply per-bullet AI improvements." />
        <FaqItem q="How many resumes can I create?" a="Free plan: 1 resume. Paid plans: 3, 5, or unlimited. You can also duplicate any resume to tailor for a different role." />
        <FaqItem q="What formats can I download?" a="High-quality PDF (print-ready, ATS-friendly), editable DOCX, and plain TXT for systems that reject formatted files." />
        <FaqItem q="Do you offer refunds?" a="Yes — 7-day no-questions refund on all paid plans." />
      </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="bg-gradient-to-br from-brand/40 to-gold/20 py-20">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="font-display text-4xl font-bold md:text-5xl">Ready to Land Your Dream Job?</h2>
        <p className="mt-4 text-white/80">No credit card required. Build your first resume in 60 seconds.</p>
        <Link href="/signup" className="btn-primary mt-8 inline-flex">Start Building Free →</Link>
        <div className="mt-6 text-xs text-white/50">⭐ 4.9/5 average rating · 12,400+ resumes built this month</div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-navy/90 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2 font-display text-lg font-bold">
              <span className="inline-block h-6 w-6 rounded-md bg-gradient-to-br from-brand to-gold" />
              ResumeAI <span className="text-gold">Pro</span>
            </Link>
            <p className="mt-3 text-xs text-white/50">
              AI-powered resume builder for every career stage.
            </p>
          </div>
          <FooterCol title="Product" links={[
            { label: "Features", href: "#features" },
            { label: "Pricing", href: "#pricing" },
            { label: "Templates", href: "#features" },
            { label: "ATS Checker", href: "#features" },
          ]} />
          <FooterCol title="Company" links={[
            { label: "About", href: "#" },
            { label: "Blog", href: "#" },
            { label: "Careers", href: "#" },
            { label: "Contact", href: "#" },
          ]} />
          <FooterCol title="Legal" links={[
            { label: "Privacy", href: "#" },
            { label: "Terms", href: "#" },
            { label: "Cookies", href: "#" },
            { label: "GDPR", href: "#" },
          ]} />
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/50 md:flex-row">
          <div>© {new Date().getFullYear()} ResumeAI Pro · Built with AI for ambitious careers</div>
          <div className="flex gap-4">
            <a href="#" aria-label="Twitter" className="hover:text-white transition">𝕏</a>
            <a href="#" aria-label="LinkedIn" className="hover:text-white transition">in</a>
            <a href="#" aria-label="GitHub" className="hover:text-white transition">{"</>"}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-widest text-white/70">{title}</div>
      <ul className="mt-3 space-y-2">
        {links.map((l) => (
          <li key={l.label}><a href={l.href} className="text-sm text-white/60 hover:text-white transition">{l.label}</a></li>
        ))}
      </ul>
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
      <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl lg:text-5xl">{title}</h2>
    </div>
  );
}

function UserTypeCard({
  emoji, title, desc, bullets, href, cta, highlight,
}: { emoji: string; title: string; desc: string; bullets: string[]; href: string; cta: string; highlight?: boolean }) {
  return (
    <div className={`glass relative rounded-2xl p-6 transition hover:bg-white/10 hover:-translate-y-1 ${highlight ? "ring-2 ring-brand md:scale-105" : ""}`}>
      {highlight && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-brand to-gold px-3 py-0.5 text-xs font-semibold text-white">
          Most popular
        </div>
      )}
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

function PricingCard({
  plan, price, sub, features, badge, highlight, cta, href,
}: { plan: string; price: string; sub?: string; features: string[]; badge?: string; highlight?: boolean; cta: string; href: string }) {
  return (
    <div className={`relative rounded-2xl border p-6 transition ${highlight ? "border-brand bg-gradient-to-br from-brand/20 to-brand/5 shadow-2xl shadow-brand/20 md:scale-110 md:py-8" : "border-white/10 bg-white/[0.03] hover:border-white/30"}`}>
      {badge && (
        <div className={`absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-0.5 text-xs font-semibold ${highlight ? "bg-gradient-to-r from-brand to-gold text-white" : "bg-gold text-navy"}`}>{badge}</div>
      )}
      <div className="font-display text-lg font-semibold">{plan}</div>
      <div className="mt-2 flex items-baseline gap-1">
        <span className="text-3xl font-bold">{price}</span>
        {sub && <span className="text-sm text-white/60">{sub}</span>}
      </div>
      <ul className="mt-5 space-y-2 text-sm text-white/80">
        {features.map((f) => <li key={f} className="flex gap-2"><span className="text-green-400">✓</span> {f}</li>)}
      </ul>
      <Link href={href} className={`mt-6 block w-full ${highlight ? "btn-primary" : "btn-ghost"}`}>{cta}</Link>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="group glass rounded-xl px-5 py-4 transition open:bg-white/[0.08]">
      <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
        <span>{q}</span>
        <span className="ml-4 inline-block h-5 w-5 shrink-0 transition group-open:rotate-180">
          <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.39a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
          </svg>
        </span>
      </summary>
      <p className="mt-3 text-sm text-white/70 leading-relaxed">{a}</p>
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
      {/* Floating ATS badge */}
      <div className="absolute -right-4 -top-4 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 p-3 shadow-xl float-up">
        <div className="text-[10px] font-semibold uppercase tracking-widest text-white/90">ATS Score</div>
        <div className="font-display text-2xl font-bold text-white">94</div>
      </div>
    </div>
  );
}
