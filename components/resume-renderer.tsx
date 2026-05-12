import type { GeneratedResume } from "@/lib/types";

export type Template = "modern" | "classic" | "compact" | "executive";

export const TEMPLATES: { id: Template; name: string; desc: string }[] = [
  { id: "modern", name: "Modern", desc: "Blue accent · clean sans-serif" },
  { id: "classic", name: "Classic", desc: "Centered · timeless serif feel" },
  { id: "compact", name: "Compact", desc: "Tighter spacing · fits more" },
  { id: "executive", name: "Executive", desc: "Bold · senior-friendly" },
];

type Props = {
  generated: GeneratedResume;
  fullName: string;
  contact: Record<string, string | undefined>;
  targetRole: string;
  template?: Template;
};

export default function ResumeRenderer(props: Props) {
  const t = props.template ?? "modern";
  if (t === "classic") return <ClassicTemplate {...props} />;
  if (t === "compact") return <CompactTemplate {...props} />;
  if (t === "executive") return <ExecutiveTemplate {...props} />;
  return <ModernTemplate {...props} />;
}

function ModernTemplate({ generated, fullName, contact, targetRole }: Props) {
  return (
    <div className="resume-paper bg-white px-12 py-10 text-slate-900">
      <header className="border-b border-slate-300 pb-4">
        <h1 className="font-display text-3xl font-bold tracking-tight">{fullName}</h1>
        {targetRole && <div className="mt-1 text-sm font-medium uppercase tracking-widest text-brand">{targetRole}</div>}
        <ContactLine contact={contact} />
      </header>
      <Sections generated={generated} accent="text-brand" hr="border-slate-200" />
    </div>
  );
}

function ClassicTemplate({ generated, fullName, contact, targetRole }: Props) {
  return (
    <div className="resume-paper bg-white px-12 py-10 text-slate-900" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
      <header className="text-center border-b-2 border-slate-700 pb-4">
        <h1 className="text-3xl font-bold tracking-wide">{fullName}</h1>
        {targetRole && <div className="mt-1 text-sm uppercase tracking-[0.2em] text-slate-700">{targetRole}</div>}
        <div className="mt-2 flex flex-wrap justify-center gap-x-3 text-xs text-slate-600">
          {contact.email && <span>{contact.email}</span>}
          {contact.phone && <span>· {contact.phone}</span>}
          {contact.location && <span>· {contact.location}</span>}
          {contact.linkedin && <span>· {contact.linkedin}</span>}
          {contact.github && <span>· {contact.github}</span>}
          {contact.portfolio && <span>· {contact.portfolio}</span>}
        </div>
      </header>
      <Sections generated={generated} accent="text-slate-900" hr="border-slate-300" centered />
    </div>
  );
}

function CompactTemplate({ generated, fullName, contact, targetRole }: Props) {
  return (
    <div className="resume-paper bg-white px-10 py-8 text-slate-900 text-[13px] leading-snug">
      <header className="border-b border-slate-300 pb-2">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h1 className="font-display text-2xl font-bold">{fullName}</h1>
          <div className="text-[11px] text-slate-600">
            {[contact.email, contact.phone, contact.location, contact.linkedin].filter(Boolean).join(" · ")}
          </div>
        </div>
        {targetRole && <div className="text-xs uppercase tracking-widest text-brand">{targetRole}</div>}
      </header>
      <Sections generated={generated} accent="text-brand" hr="border-slate-200" tight />
    </div>
  );
}

function ExecutiveTemplate({ generated, fullName, contact, targetRole }: Props) {
  return (
    <div className="resume-paper bg-white px-12 py-10 text-slate-900">
      <header className="bg-slate-900 -mx-12 -mt-10 px-12 pb-6 pt-8 text-white">
        <h1 className="font-display text-4xl font-extrabold tracking-tight">{fullName}</h1>
        {targetRole && <div className="mt-1 text-sm font-semibold uppercase tracking-[0.18em] text-gold">{targetRole}</div>}
        <div className="mt-3 flex flex-wrap gap-x-4 text-xs text-white/80">
          {contact.email && <span>{contact.email}</span>}
          {contact.phone && <span>· {contact.phone}</span>}
          {contact.location && <span>· {contact.location}</span>}
          {contact.linkedin && <span>· {contact.linkedin}</span>}
        </div>
      </header>
      <div className="mt-6">
        <Sections generated={generated} accent="text-slate-900" hr="border-slate-300" boldHeads />
      </div>
    </div>
  );
}

function ContactLine({ contact }: { contact: Record<string, string | undefined> }) {
  return (
    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">
      {contact.email && <span>{contact.email}</span>}
      {contact.phone && <span>· {contact.phone}</span>}
      {contact.location && <span>· {contact.location}</span>}
      {contact.linkedin && <span>· {contact.linkedin}</span>}
      {contact.github && <span>· {contact.github}</span>}
      {contact.portfolio && <span>· {contact.portfolio}</span>}
    </div>
  );
}

function Sections({ generated, accent, hr, centered, tight, boldHeads }: { generated: GeneratedResume; accent: string; hr: string; centered?: boolean; tight?: boolean; boldHeads?: boolean }) {
  return (
    <div className={tight ? "space-y-3" : "space-y-5"}>
      {generated.sections.map((section, i) => (
        <section key={i} className={tight ? "mt-3" : "mt-5"}>
          <h2 className={`${hr} ${boldHeads ? "border-b-2" : "border-b"} pb-1 text-[11px] font-bold uppercase tracking-[0.18em] ${accent} ${centered ? "text-center" : ""}`}>
            {section.title}
          </h2>
          <div className={`${tight ? "mt-2 space-y-2" : "mt-3 space-y-3"} text-sm`}>
            {section.items.map((item, j) => (
              <div key={j}>
                {item.heading && (
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div className="font-semibold">{item.heading}</div>
                    {item.meta && <div className="text-xs text-slate-500">{item.meta}</div>}
                  </div>
                )}
                {item.subheading && <div className="italic text-slate-700">{item.subheading}</div>}
                {item.body && <p className="mt-1 leading-relaxed text-slate-800">{item.body}</p>}
                {item.bullets && (
                  <ul className="mt-1 list-disc space-y-1 pl-5 text-slate-800">
                    {item.bullets.map((b, k) => <li key={k}>{b}</li>)}
                  </ul>
                )}
                {item.tags && item.tags.length > 0 && (
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {item.tags.map((t, k) => (
                      <span key={k} className="rounded bg-slate-100 px-2 py-0.5 text-[11px] text-slate-700">{t}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
