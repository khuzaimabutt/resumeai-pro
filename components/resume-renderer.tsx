import type { GeneratedResume } from "@/lib/types";

export default function ResumeRenderer({
  generated, fullName, contact, targetRole,
}: {
  generated: GeneratedResume;
  fullName: string;
  contact: Record<string, string | undefined>;
  targetRole: string;
}) {
  return (
    <div className="resume-paper bg-white px-12 py-10 text-slate-900">
      {/* Header */}
      <header className="border-b border-slate-300 pb-4">
        <h1 className="font-display text-3xl font-bold tracking-tight">{fullName}</h1>
        {targetRole && <div className="mt-1 text-sm font-medium uppercase tracking-widest text-brand">{targetRole}</div>}
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">
          {contact.email && <span>{contact.email}</span>}
          {contact.phone && <span>· {contact.phone}</span>}
          {contact.location && <span>· {contact.location}</span>}
          {contact.linkedin && <span>· {contact.linkedin}</span>}
          {contact.github && <span>· {contact.github}</span>}
          {contact.portfolio && <span>· {contact.portfolio}</span>}
        </div>
      </header>

      {/* Sections */}
      <div className="space-y-5">
        {generated.sections.map((section, i) => (
          <section key={i} className="mt-5">
            <h2 className="border-b border-slate-200 pb-1 text-[11px] font-bold uppercase tracking-[0.18em] text-brand">
              {section.title}
            </h2>
            <div className="mt-3 space-y-3 text-sm">
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
    </div>
  );
}
