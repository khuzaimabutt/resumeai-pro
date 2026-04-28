"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { ResumeContent, UserType } from "@/lib/types";

type Resume = {
  id: string;
  title: string;
  user_type: UserType;
  target_role: string | null;
  content: ResumeContent;
};
type Profile = { credits_remaining: number; full_name: string | null; email: string };

const TABS = ["Basics", "Experience", "Education", "Skills", "Extras"] as const;
type Tab = typeof TABS[number];

export default function BuilderForm({ resume, profile }: { resume: Resume; profile: Profile }) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("Basics");
  const [title, setTitle] = useState(resume.title);
  const [targetRole, setTargetRole] = useState(resume.target_role ?? "");
  const [userType, setUserType] = useState<UserType>(resume.user_type);
  const [content, setContent] = useState<ResumeContent>(() => seedContent(resume.content, profile));
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [genMessage, setGenMessage] = useState("");
  const lastSaved = useRef<string>("");

  // Autosave every ~1.5s after typing stops
  useEffect(() => {
    const payload = JSON.stringify({ title, targetRole, userType, content });
    if (payload === lastSaved.current) return;
    const timer = setTimeout(async () => {
      setSaving(true);
      const res = await fetch(`/api/resumes/${resume.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, target_role: targetRole, user_type: userType, content }),
      });
      if (res.ok) lastSaved.current = payload;
      setSaving(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [title, targetRole, userType, content, resume.id]);

  const completeness = useMemo(() => {
    let total = 5; let filled = 0;
    if (content.personal?.full_name && content.personal?.email) filled++;
    if ((content.experiences?.length ?? 0) + (content.projects?.length ?? 0) > 0) filled++;
    if ((content.educations?.length ?? 0) > 0) filled++;
    if ((content.skills?.technical?.length ?? 0) > 0) filled++;
    if (targetRole) filled++;
    return Math.round((filled / total) * 100);
  }, [content, targetRole]);

  async function generate() {
    if (!targetRole) { alert("Please enter a target role first."); setTab("Basics"); return; }
    setGenerating(true);
    const messages = [
      "Reading your details...",
      "Choosing the best words...",
      "Optimizing for ATS systems...",
      "Adding the finishing touches...",
      "Almost ready...",
    ];
    let i = 0;
    setGenMessage(messages[0]);
    const cycle = setInterval(() => { i = (i + 1) % messages.length; setGenMessage(messages[i]); }, 1200);

    try {
      // Save first
      await fetch(`/api/resumes/${resume.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, target_role: targetRole, user_type: userType, content }),
      });
      const res = await fetch(`/api/resumes/${resume.id}/generate`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      router.push(`/preview/${resume.id}`);
    } catch (e: any) {
      alert(e.message);
      setGenerating(false);
    } finally {
      clearInterval(cycle);
    }
  }

  if (generating) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div className="mb-6 inline-block h-14 w-14 animate-spin rounded-full border-4 border-brand/20 border-t-brand" />
        <h2 className="font-display text-2xl font-bold">Generating your resume...</h2>
        <p className="mt-2 text-slate-600">{genMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_460px]">
      {/* Left: form */}
      <div className="space-y-4">
        {/* Header bar */}
        <div className="card">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <input
              className="input max-w-sm text-lg font-semibold"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Resume title"
            />
            <div className="flex items-center gap-2 text-xs text-slate-500">
              {saving ? "Saving..." : "Saved ✓"} · {completeness}% complete
            </div>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div>
              <label className="label">Target role</label>
              <input className="input" value={targetRole} onChange={(e) => setTargetRole(e.target.value)} placeholder="e.g. Senior Frontend Engineer" />
            </div>
            <div>
              <label className="label">Resume style</label>
              <select className="input" value={userType} onChange={(e) => setUserType(e.target.value as UserType)}>
                <option value="fresher">Fresher (entry-level)</option>
                <option value="intermediate">Intermediate (1–5 yrs)</option>
                <option value="professional">Professional (5+ yrs)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="card">
          <div className="mb-4 flex flex-wrap gap-1 border-b border-slate-200">
            {TABS.map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-4 py-2 text-sm font-medium transition ${tab === t ? "border-b-2 border-brand text-brand" : "text-slate-500 hover:text-slate-900"}`}>
                {t}
              </button>
            ))}
          </div>

          {tab === "Basics" && <BasicsTab content={content} setContent={setContent} userType={userType} />}
          {tab === "Experience" && <ExperienceTab content={content} setContent={setContent} userType={userType} />}
          {tab === "Education" && <EducationTab content={content} setContent={setContent} />}
          {tab === "Skills" && <SkillsTab content={content} setContent={setContent} />}
          {tab === "Extras" && <ExtrasTab content={content} setContent={setContent} />}
        </div>

        {/* Generate */}
        <div className="card flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="font-display text-lg font-semibold">Ready to generate?</div>
            <div className="text-sm text-slate-500">
              Uses 1 credit · You have <strong>{profile.credits_remaining}</strong> remaining
            </div>
          </div>
          <button onClick={generate} className="btn-primary" disabled={profile.credits_remaining <= 0}>
            {profile.credits_remaining <= 0 ? "Out of credits" : "Generate with AI →"}
          </button>
        </div>
      </div>

      {/* Right: live preview */}
      <aside className="lg:sticky lg:top-20 lg:h-[calc(100vh-6rem)]">
        <div className="card h-full overflow-auto">
          <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Live preview</div>
          <LivePreview content={content} userType={userType} targetRole={targetRole} />
        </div>
      </aside>
    </div>
  );
}

function seedContent(c: ResumeContent, p: Profile): ResumeContent {
  return {
    ...c,
    personal: {
      full_name: c.personal?.full_name || p.full_name || "",
      email: c.personal?.email || p.email,
      phone: c.personal?.phone || "",
      location: c.personal?.location || "",
      linkedin: c.personal?.linkedin || "",
      github: c.personal?.github || "",
      portfolio: c.personal?.portfolio || "",
      summary: c.personal?.summary || "",
      industry: c.personal?.industry || "",
      years_experience: c.personal?.years_experience || 0,
    },
    experiences: c.experiences ?? [],
    projects: c.projects ?? [],
    educations: c.educations ?? [],
    skills: c.skills ?? { technical: [], tools: [], soft: [], languages: [] },
    certifications: c.certifications ?? [],
    achievements: c.achievements ?? [],
  };
}

/* ───────── tab components ───────── */

function BasicsTab({
  content, setContent, userType,
}: { content: ResumeContent; setContent: (c: ResumeContent) => void; userType: UserType }) {
  const p = content.personal!;
  const upd = (patch: Partial<typeof p>) => setContent({ ...content, personal: { ...p, ...patch } });

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div><label className="label">Full name</label><input className="input" value={p.full_name ?? ""} onChange={(e) => upd({ full_name: e.target.value })} /></div>
      <div><label className="label">Email</label><input className="input" value={p.email ?? ""} onChange={(e) => upd({ email: e.target.value })} /></div>
      <div><label className="label">Phone</label><input className="input" value={p.phone ?? ""} onChange={(e) => upd({ phone: e.target.value })} /></div>
      <div><label className="label">Location</label><input className="input" value={p.location ?? ""} onChange={(e) => upd({ location: e.target.value })} /></div>
      <div><label className="label">LinkedIn</label><input className="input" value={p.linkedin ?? ""} onChange={(e) => upd({ linkedin: e.target.value })} /></div>
      {userType !== "professional" && (
        <div><label className="label">GitHub</label><input className="input" value={p.github ?? ""} onChange={(e) => upd({ github: e.target.value })} /></div>
      )}
      <div className="md:col-span-2"><label className="label">Portfolio / website</label><input className="input" value={p.portfolio ?? ""} onChange={(e) => upd({ portfolio: e.target.value })} /></div>
      {userType === "professional" && (
        <>
          <div><label className="label">Years of experience</label><input type="number" className="input" value={p.years_experience ?? 0} onChange={(e) => upd({ years_experience: Number(e.target.value) })} /></div>
          <div><label className="label">Industry</label>
            <select className="input" value={p.industry ?? ""} onChange={(e) => upd({ industry: e.target.value })}>
              <option value="">Choose...</option>
              {["Technology", "Finance", "Healthcare", "Marketing", "Education", "Legal", "Engineering", "Other"].map((x) => <option key={x}>{x}</option>)}
            </select>
          </div>
        </>
      )}
    </div>
  );
}

function ExperienceTab({
  content, setContent, userType,
}: { content: ResumeContent; setContent: (c: ResumeContent) => void; userType: UserType }) {
  if (userType === "fresher") {
    return <ProjectsEditor content={content} setContent={setContent} />;
  }
  return <ExperiencesEditor content={content} setContent={setContent} />;
}

function ProjectsEditor({ content, setContent }: { content: ResumeContent; setContent: (c: ResumeContent) => void }) {
  const projects = content.projects ?? [];
  const update = (next: typeof projects) => setContent({ ...content, projects: next });

  return (
    <div className="space-y-4">
      <p className="rounded-md bg-blue-50 px-3 py-2 text-sm text-blue-900">
        💡 Your projects ARE your experience. Add every significant one.
      </p>
      {projects.map((p, i) => (
        <div key={i} className="rounded-lg border border-slate-200 p-4">
          <div className="grid gap-3 md:grid-cols-2">
            <input className="input" placeholder="Project name" value={p.name} onChange={(e) => { const n = [...projects]; n[i] = { ...p, name: e.target.value }; update(n); }} />
            <input className="input" placeholder="Live URL (optional)" value={p.url ?? ""} onChange={(e) => { const n = [...projects]; n[i] = { ...p, url: e.target.value }; update(n); }} />
          </div>
          <textarea className="input mt-3" placeholder="What does it do? Why does it matter?" rows={2}
            value={p.description ?? ""} onChange={(e) => { const n = [...projects]; n[i] = { ...p, description: e.target.value }; update(n); }} />
          <TagInput label="Technologies" value={p.technologies ?? []} onChange={(tags) => { const n = [...projects]; n[i] = { ...p, technologies: tags }; update(n); }} />
          <button className="mt-3 text-sm text-red-500 hover:underline" onClick={() => update(projects.filter((_, j) => j !== i))}>Remove</button>
        </div>
      ))}
      <button className="btn-secondary" onClick={() => update([...projects, { name: "", description: "", technologies: [] }])}>+ Add project</button>
    </div>
  );
}

function ExperiencesEditor({ content, setContent }: { content: ResumeContent; setContent: (c: ResumeContent) => void }) {
  const exps = content.experiences ?? [];
  const update = (next: typeof exps) => setContent({ ...content, experiences: next });

  return (
    <div className="space-y-4">
      {exps.map((e, i) => (
        <div key={i} className="rounded-lg border border-slate-200 p-4">
          <div className="grid gap-3 md:grid-cols-2">
            <input className="input" placeholder="Job title" value={e.title} onChange={(ev) => { const n = [...exps]; n[i] = { ...e, title: ev.target.value }; update(n); }} />
            <input className="input" placeholder="Company" value={e.company} onChange={(ev) => { const n = [...exps]; n[i] = { ...e, company: ev.target.value }; update(n); }} />
            <input className="input" placeholder="Start date (MM/YYYY)" value={e.start_date ?? ""} onChange={(ev) => { const n = [...exps]; n[i] = { ...e, start_date: ev.target.value }; update(n); }} />
            <input className="input" placeholder="End date or 'Present'" value={e.end_date ?? ""} onChange={(ev) => { const n = [...exps]; n[i] = { ...e, end_date: ev.target.value }; update(n); }} />
          </div>
          <BulletEditor label="Responsibilities & achievements" value={e.bullets ?? []} onChange={(b) => { const n = [...exps]; n[i] = { ...e, bullets: b }; update(n); }} />
          <TagInput label="Technologies / tools" value={e.technologies ?? []} onChange={(t) => { const n = [...exps]; n[i] = { ...e, technologies: t }; update(n); }} />
          <button className="mt-3 text-sm text-red-500 hover:underline" onClick={() => update(exps.filter((_, j) => j !== i))}>Remove</button>
        </div>
      ))}
      <button className="btn-secondary" onClick={() => update([...exps, { company: "", title: "", bullets: [], technologies: [] }])}>+ Add experience</button>
    </div>
  );
}

function EducationTab({ content, setContent }: { content: ResumeContent; setContent: (c: ResumeContent) => void }) {
  const eds = content.educations ?? [];
  const update = (next: typeof eds) => setContent({ ...content, educations: next });
  return (
    <div className="space-y-4">
      {eds.map((e, i) => (
        <div key={i} className="rounded-lg border border-slate-200 p-4">
          <div className="grid gap-3 md:grid-cols-2">
            <input className="input" placeholder="Degree" value={e.degree} onChange={(ev) => { const n = [...eds]; n[i] = { ...e, degree: ev.target.value }; update(n); }} />
            <input className="input" placeholder="Institution" value={e.institution} onChange={(ev) => { const n = [...eds]; n[i] = { ...e, institution: ev.target.value }; update(n); }} />
            <input className="input" placeholder="Field of study" value={e.field ?? ""} onChange={(ev) => { const n = [...eds]; n[i] = { ...e, field: ev.target.value }; update(n); }} />
            <input className="input" placeholder="GPA / percentage" value={e.gpa ?? ""} onChange={(ev) => { const n = [...eds]; n[i] = { ...e, gpa: ev.target.value }; update(n); }} />
            <input className="input" placeholder="Start year" value={e.start_year ?? ""} onChange={(ev) => { const n = [...eds]; n[i] = { ...e, start_year: ev.target.value }; update(n); }} />
            <input className="input" placeholder="End year" value={e.end_year ?? ""} onChange={(ev) => { const n = [...eds]; n[i] = { ...e, end_year: ev.target.value }; update(n); }} />
          </div>
          <button className="mt-3 text-sm text-red-500 hover:underline" onClick={() => update(eds.filter((_, j) => j !== i))}>Remove</button>
        </div>
      ))}
      <button className="btn-secondary" onClick={() => update([...eds, { degree: "", institution: "", field: "" }])}>+ Add education</button>
    </div>
  );
}

function SkillsTab({ content, setContent }: { content: ResumeContent; setContent: (c: ResumeContent) => void }) {
  const sk = content.skills!;
  const upd = (patch: Partial<typeof sk>) => setContent({ ...content, skills: { ...sk, ...patch } });
  return (
    <div className="space-y-4">
      <TagInput label="Technical skills" value={sk.technical ?? []} onChange={(v) => upd({ technical: v })} />
      <TagInput label="Tools & software" value={sk.tools ?? []} onChange={(v) => upd({ tools: v })} />
      <TagInput label="Soft skills" value={sk.soft ?? []} onChange={(v) => upd({ soft: v })} />
      <TagInput label="Languages spoken" value={sk.languages ?? []} onChange={(v) => upd({ languages: v })} />
    </div>
  );
}

function ExtrasTab({ content, setContent }: { content: ResumeContent; setContent: (c: ResumeContent) => void }) {
  const certs = content.certifications ?? [];
  const updateCerts = (next: typeof certs) => setContent({ ...content, certifications: next });
  return (
    <div className="space-y-5">
      <div>
        <div className="label">Certifications</div>
        {certs.map((c, i) => (
          <div key={i} className="mt-2 grid gap-2 md:grid-cols-3">
            <input className="input" placeholder="Name" value={c.name} onChange={(e) => { const n = [...certs]; n[i] = { ...c, name: e.target.value }; updateCerts(n); }} />
            <input className="input" placeholder="Provider" value={c.provider ?? ""} onChange={(e) => { const n = [...certs]; n[i] = { ...c, provider: e.target.value }; updateCerts(n); }} />
            <div className="flex gap-2">
              <input className="input" placeholder="Year" value={c.year ?? ""} onChange={(e) => { const n = [...certs]; n[i] = { ...c, year: e.target.value }; updateCerts(n); }} />
              <button className="text-sm text-red-500" onClick={() => updateCerts(certs.filter((_, j) => j !== i))}>×</button>
            </div>
          </div>
        ))}
        <button className="btn-secondary mt-2" onClick={() => updateCerts([...certs, { name: "", provider: "", year: "" }])}>+ Add certification</button>
      </div>
      <div>
        <div className="label">Key achievements (one per line)</div>
        <textarea className="input min-h-[120px]" value={(content.achievements ?? []).join("\n")}
          onChange={(e) => setContent({ ...content, achievements: e.target.value.split("\n").filter(Boolean) })}
          placeholder="Won university hackathon&#10;Led 6-person research team&#10;Published in IEEE Xplore" />
      </div>
    </div>
  );
}

/* ───────── shared editors ───────── */

function TagInput({ label, value, onChange }: { label: string; value: string[]; onChange: (v: string[]) => void }) {
  const [input, setInput] = useState("");
  return (
    <div className="mt-3">
      <label className="label">{label}</label>
      <div className="flex flex-wrap gap-1.5 rounded-lg border border-slate-300 bg-white px-2 py-2">
        {value.map((t, i) => (
          <span key={i} className="inline-flex items-center gap-1 rounded-md bg-brand/10 px-2 py-0.5 text-xs text-brand">
            {t}
            <button onClick={() => onChange(value.filter((_, j) => j !== i))} className="text-brand/60 hover:text-brand">×</button>
          </span>
        ))}
        <input
          className="min-w-[120px] flex-1 bg-transparent text-sm focus:outline-none"
          placeholder="Type and press Enter"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if ((e.key === "Enter" || e.key === ",") && input.trim()) {
              e.preventDefault();
              onChange([...value, input.trim()]);
              setInput("");
            } else if (e.key === "Backspace" && !input && value.length) {
              onChange(value.slice(0, -1));
            }
          }}
        />
      </div>
    </div>
  );
}

function BulletEditor({ label, value, onChange }: { label: string; value: string[]; onChange: (v: string[]) => void }) {
  return (
    <div className="mt-3">
      <label className="label">{label}</label>
      <div className="space-y-2">
        {value.map((b, i) => (
          <div key={i} className="flex gap-2">
            <textarea className="input min-h-[44px]" value={b} onChange={(e) => { const n = [...value]; n[i] = e.target.value; onChange(n); }} />
            <button className="text-red-500" onClick={() => onChange(value.filter((_, j) => j !== i))}>×</button>
          </div>
        ))}
      </div>
      <button className="btn-secondary mt-2" onClick={() => onChange([...value, ""])}>+ Add bullet</button>
    </div>
  );
}

/* ───────── live preview ───────── */

function LivePreview({ content, userType, targetRole }: { content: ResumeContent; userType: UserType; targetRole: string }) {
  const p = content.personal ?? {};
  return (
    <div className="origin-top scale-[0.85] text-[11px] text-slate-800 transform-gpu">
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <div className="border-b pb-3">
          <div className="font-display text-xl font-bold">{p.full_name || "Your Name"}</div>
          <div className="text-xs text-slate-500">{targetRole || "Target Role"}</div>
          <div className="mt-1 flex flex-wrap gap-x-3 text-[10px] text-slate-500">
            {p.email && <span>{p.email}</span>}
            {p.phone && <span>· {p.phone}</span>}
            {p.location && <span>· {p.location}</span>}
            {p.linkedin && <span>· LinkedIn</span>}
            {p.github && <span>· GitHub</span>}
          </div>
        </div>

        {(content.experiences?.length ?? 0) > 0 && userType !== "fresher" && (
          <Section title="Experience">
            {content.experiences!.map((e, i) => (
              <div key={i} className="mb-2">
                <div className="flex justify-between font-semibold">{e.title || "Job title"} <span className="text-slate-500 font-normal">{e.start_date} – {e.end_date}</span></div>
                <div className="italic text-slate-600">{e.company}</div>
                <ul className="mt-1 list-disc pl-4 text-slate-700">
                  {(e.bullets ?? []).filter(Boolean).slice(0, 3).map((b, j) => <li key={j}>{b}</li>)}
                </ul>
              </div>
            ))}
          </Section>
        )}

        {(content.projects?.length ?? 0) > 0 && (
          <Section title="Projects">
            {content.projects!.map((pr, i) => (
              <div key={i} className="mb-2">
                <div className="font-semibold">{pr.name || "Project"}</div>
                <div className="text-slate-700">{pr.description}</div>
                <div className="mt-1 flex flex-wrap gap-1">
                  {(pr.technologies ?? []).map((t, j) => <span key={j} className="rounded bg-slate-100 px-1.5 text-[10px]">{t}</span>)}
                </div>
              </div>
            ))}
          </Section>
        )}

        {(content.educations?.length ?? 0) > 0 && (
          <Section title="Education">
            {content.educations!.map((e, i) => (
              <div key={i}>
                <div className="font-semibold">{e.degree}{e.field ? `, ${e.field}` : ""}</div>
                <div className="text-slate-600">{e.institution} · {e.start_year} – {e.end_year}</div>
              </div>
            ))}
          </Section>
        )}

        {((content.skills?.technical?.length ?? 0) > 0) && (
          <Section title="Skills">
            <div className="flex flex-wrap gap-1">
              {[...(content.skills?.technical ?? []), ...(content.skills?.tools ?? [])].map((s, i) => (
                <span key={i} className="rounded bg-slate-100 px-1.5 text-[10px]">{s}</span>
              ))}
            </div>
          </Section>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-3">
      <div className="text-[10px] font-semibold uppercase tracking-widest text-brand">{title}</div>
      <div className="mt-1">{children}</div>
    </div>
  );
}
