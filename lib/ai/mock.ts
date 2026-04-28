import type { ResumeContent, GeneratedResume, UserType } from "@/lib/types";

// Deterministic mock AI — produces resume content that looks like it came from GPT-4o.
// Uses templated phrases and the user's actual inputs to feel personalized.

const ACTION_VERBS = {
  fresher: ["Built", "Developed", "Designed", "Implemented", "Engineered", "Created", "Architected", "Programmed"],
  intermediate: ["Led", "Delivered", "Optimized", "Drove", "Owned", "Streamlined", "Scaled", "Improved"],
  professional: ["Spearheaded", "Architected", "Transformed", "Championed", "Orchestrated", "Pioneered", "Directed", "Established"],
};

function pick<T>(arr: T[], i: number): T {
  return arr[i % arr.length];
}

function sentence(parts: (string | undefined | false | null)[]): string {
  return parts.filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
}

function quantify(text: string, seed: number): string {
  // Add fake metrics if none present, to look impressive.
  if (/\d/.test(text)) return text;
  const metrics = [
    "improving efficiency by 35%",
    "reducing turnaround time by 40%",
    "serving 10K+ users",
    "increasing engagement by 28%",
    "cutting costs by 22%",
    "with 99.9% uptime",
    "across 5 teams",
    "driving 3x throughput",
  ];
  return `${text}, ${pick(metrics, seed)}`;
}

function buildHeadline(c: ResumeContent, type: UserType, target: string): string {
  const name = c.personal?.full_name?.split(" ")[0] ?? "Candidate";
  const yrs = c.personal?.years_experience ?? 0;

  if (type === "fresher") {
    return sentence([
      `Driven and detail-oriented graduate seeking a ${target} role to apply hands-on experience from`,
      (c.projects?.length ?? 0) > 0 ? `${c.projects!.length}+ technical projects` : "academic projects",
      "and a strong foundation in modern tooling. Eager to contribute, learn rapidly, and deliver measurable value from day one.",
    ]);
  }
  if (type === "intermediate") {
    return sentence([
      `Results-focused ${target} with ${yrs || 3}+ years of experience shipping production-grade software.`,
      "Proven track record of translating ambiguous requirements into reliable, well-tested systems.",
      "Looking to bring strong engineering judgment and team-first collaboration to an ambitious next role.",
    ]);
  }
  return sentence([
    `Senior ${target} executive with ${yrs || 8}+ years leading high-impact teams across complex, multi-stakeholder initiatives.`,
    "Recognized for architecting scalable solutions, building world-class organizations, and consistently exceeding revenue and operational targets.",
    "Trusted advisor at the C-suite level with a relentless focus on outcomes, governance, and durable competitive advantage.",
    `Seeking a ${target} mandate where strategic vision and operational rigor compound.`,
  ]);
}

export async function mockGenerate(
  content: ResumeContent,
  type: UserType,
  targetRole: string
): Promise<GeneratedResume> {
  // Simulate network/AI latency for realism (1.5–3.5s)
  const delay = 1500 + Math.floor(Math.random() * 2000);
  await new Promise((r) => setTimeout(r, delay));

  const target = targetRole || "Software Engineer";
  const verbs = ACTION_VERBS[type];

  const headline = buildHeadline(content, type, target);
  const sections: GeneratedResume["sections"] = [];

  // Summary as its own section
  sections.push({
    title:
      type === "fresher" ? "OBJECTIVE" :
      type === "intermediate" ? "PROFESSIONAL SUMMARY" :
      "EXECUTIVE SUMMARY",
    items: [{ body: headline }],
  });

  // Core Competencies for professionals
  if (type === "professional") {
    const skills = [
      ...(content.skills?.technical ?? []),
      ...(content.skills?.tools ?? []),
      ...(content.skills?.soft ?? []),
    ];
    const competencies = skills.slice(0, 12);
    while (competencies.length < 12) {
      const fillers = ["Strategic Planning", "P&L Ownership", "Stakeholder Mgmt", "Org Design", "Change Mgmt", "Board Reporting", "Risk Governance", "M&A Integration", "Culture Building", "GTM Strategy", "Operational Excellence", "Talent Development"];
      competencies.push(fillers[competencies.length % fillers.length]);
    }
    sections.push({
      title: "CORE COMPETENCIES",
      items: [{ tags: competencies }],
    });
  }

  // Experience (intermediate / professional)
  if (type !== "fresher" && (content.experiences?.length ?? 0) > 0) {
    sections.push({
      title: type === "professional" ? "PROFESSIONAL EXPERIENCE" : "WORK EXPERIENCE",
      items: content.experiences!.map((exp, idx) => {
        const bullets = (exp.bullets ?? []).map((b, i) => {
          const verb = pick(verbs, idx + i);
          const trimmed = b.trim().replace(/^[-•\s]+/, "").replace(/^[a-z]/, (c) => c.toUpperCase());
          // Replace any leading verb with one fitting the seniority
          const noLead = trimmed.replace(/^\w+\s/, "");
          const rewritten = `${verb} ${noLead}`;
          return quantify(rewritten, idx * 10 + i);
        });
        return {
          heading: exp.title,
          subheading: exp.company + (exp.location ? ` — ${exp.location}` : ""),
          meta: `${exp.start_date ?? ""}${exp.end_date || exp.is_current ? " – " + (exp.is_current ? "Present" : exp.end_date) : ""}`,
          bullets,
          tags: exp.technologies,
        };
      }),
    });
  }

  // Projects (fresher primary; others if present)
  if ((content.projects?.length ?? 0) > 0) {
    sections.push({
      title: "PROJECTS",
      items: content.projects!.map((p, i) => {
        const verb = pick(verbs, i);
        const desc = p.description?.trim();
        const rewritten = desc
          ? `${verb} ${desc.replace(/^[a-z]/, (c) => c.toUpperCase()).replace(/\.$/, "")}.`
          : `${verb} a full-stack application showcasing modern engineering practices.`;
        return {
          heading: p.name,
          meta: [p.url, p.github].filter(Boolean).join("  ·  "),
          body: rewritten,
          tags: p.technologies,
        };
      }),
    });
  }

  // Education
  if ((content.educations?.length ?? 0) > 0) {
    sections.push({
      title: "EDUCATION",
      items: content.educations!.map((e) => ({
        heading: e.degree + (e.field ? `, ${e.field}` : ""),
        subheading: e.institution,
        meta: [e.start_year, e.end_year].filter(Boolean).join(" – "),
        body: e.gpa ? `GPA: ${e.gpa}` : undefined,
      })),
    });
  }

  // Skills
  const sk = content.skills;
  if (sk && (sk.technical?.length || sk.tools?.length || sk.soft?.length || sk.languages?.length)) {
    const items: GeneratedResume["sections"][0]["items"] = [];
    if (sk.technical?.length) items.push({ heading: "Technical", tags: sk.technical });
    if (sk.tools?.length) items.push({ heading: "Tools", tags: sk.tools });
    if (sk.soft?.length) items.push({ heading: "Soft Skills", tags: sk.soft });
    if (sk.languages?.length) items.push({ heading: "Languages", tags: sk.languages });
    sections.push({ title: "SKILLS", items });
  }

  // Certifications
  if ((content.certifications?.length ?? 0) > 0) {
    sections.push({
      title: "CERTIFICATIONS",
      items: content.certifications!.map((c) => ({
        heading: c.name,
        subheading: c.provider,
        meta: c.year,
      })),
    });
  }

  // Achievements
  if ((content.achievements?.length ?? 0) > 0) {
    sections.push({
      title: "KEY ACHIEVEMENTS",
      items: [{ bullets: content.achievements! }],
    });
  }

  return { headline, sections };
}

export function calculateAtsScore(
  content: ResumeContent,
  generated: GeneratedResume,
  targetRole: string
): { score: number; tips: string[] } {
  let score = 50;
  const tips: string[] = [];

  // contact info
  if (content.personal?.email && content.personal?.phone) score += 10;
  else tips.push("Add complete contact info (email + phone) at the top.");

  // sections present
  score += Math.min(20, generated.sections.length * 3);

  // keywords (target role appears)
  const text = JSON.stringify(generated).toLowerCase();
  const keywords = targetRole.toLowerCase().split(/\s+/);
  const found = keywords.filter((k) => k.length > 2 && text.includes(k)).length;
  score += Math.min(15, found * 5);
  if (found < keywords.length) tips.push(`Reinforce target role keywords: "${targetRole}".`);

  // skills coverage
  const skillCount =
    (content.skills?.technical?.length ?? 0) +
    (content.skills?.tools?.length ?? 0);
  if (skillCount < 5) tips.push("Add at least 5 technical skills.");
  else score += 5;

  // bullet quantification
  const allBullets = generated.sections.flatMap((s) => s.items.flatMap((i) => i.bullets ?? []));
  const quantified = allBullets.filter((b) => /\d/.test(b)).length;
  if (allBullets.length && quantified / allBullets.length < 0.5) {
    tips.push("Quantify more achievements with metrics (numbers, %, $).");
  } else if (allBullets.length) {
    score += 5;
  }

  if (tips.length === 0) tips.push("Looking great — consider tailoring this to each job description.");

  return { score: Math.min(100, Math.max(0, score)), tips: tips.slice(0, 5) };
}
