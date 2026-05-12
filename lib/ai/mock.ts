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

  sections.push({
    title:
      type === "fresher" ? "OBJECTIVE" :
      type === "intermediate" ? "PROFESSIONAL SUMMARY" :
      "EXECUTIVE SUMMARY",
    items: [{ body: headline }],
  });

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

  if (type !== "fresher" && (content.experiences?.length ?? 0) > 0) {
    sections.push({
      title: type === "professional" ? "PROFESSIONAL EXPERIENCE" : "WORK EXPERIENCE",
      items: content.experiences!.map((exp, idx) => {
        const bullets = (exp.bullets ?? []).map((b, i) => {
          const verb = pick(verbs, idx + i);
          const trimmed = b.trim().replace(/^[-•\s]+/, "").replace(/^[a-z]/, (c) => c.toUpperCase());
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

  const sk = content.skills;
  if (sk && (sk.technical?.length || sk.tools?.length || sk.soft?.length || sk.languages?.length)) {
    const items: GeneratedResume["sections"][0]["items"] = [];
    if (sk.technical?.length) items.push({ heading: "Technical", tags: sk.technical });
    if (sk.tools?.length) items.push({ heading: "Tools", tags: sk.tools });
    if (sk.soft?.length) items.push({ heading: "Soft Skills", tags: sk.soft });
    if (sk.languages?.length) items.push({ heading: "Languages", tags: sk.languages });
    sections.push({ title: "SKILLS", items });
  }

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

  if ((content.achievements?.length ?? 0) > 0) {
    sections.push({
      title: "KEY ACHIEVEMENTS",
      items: [{ bullets: content.achievements! }],
    });
  }

  return { headline, sections };
}

// Per-bullet rewriter — rewrites a single bullet in 3 styles, picks the best one
export async function mockRewriteBullet(
  original: string,
  type: UserType,
  context?: { targetRole?: string; jobTitle?: string }
): Promise<{ variants: string[]; recommended: string }> {
  // simulate latency
  await new Promise((r) => setTimeout(r, 700 + Math.floor(Math.random() * 600)));

  const verbs = ACTION_VERBS[type];
  const cleaned = original.trim().replace(/^[-•\s]+/, "").replace(/\.$/, "");
  const lower = cleaned.toLowerCase();
  const stripLeadingVerb = (s: string) => s.replace(/^\w+\s+/, "");

  const seed = original.length;
  const v1 = quantify(`${pick(verbs, seed)} ${stripLeadingVerb(cleaned).replace(/^[a-z]/, (c) => c.toUpperCase())}`, seed);
  const v2 = quantify(`${pick(verbs, seed + 1)} ${stripLeadingVerb(cleaned)} to drive measurable business impact`, seed + 3);
  const v3 = quantify(`${pick(verbs, seed + 2)} ${stripLeadingVerb(cleaned)}, partnering cross-functionally to ship on time`, seed + 5);

  const variants = [v1, v2, v3].map((s) => s.replace(/\s+/g, " ").replace(/^./, (c) => c.toUpperCase()));
  const recommended = variants.reduce((a, b) => (a.length > b.length && a.length < 160 ? a : b));
  return { variants, recommended };
}

export type AtsTip = {
  severity: "critical" | "warning" | "suggestion";
  category: "contact" | "keywords" | "skills" | "metrics" | "structure" | "polish";
  text: string;
  fix?: string;
};

export function calculateAtsScoreV2(
  content: ResumeContent,
  generated: GeneratedResume,
  targetRole: string
): { score: number; tips: AtsTip[] } {
  let score = 50;
  const tips: AtsTip[] = [];

  if (content.personal?.email && content.personal?.phone) score += 10;
  else tips.push({ severity: "critical", category: "contact", text: "Missing complete contact info — recruiters can't reach you.", fix: "Add both email and phone in Basics." });

  if (!content.personal?.linkedin) {
    tips.push({ severity: "warning", category: "contact", text: "No LinkedIn URL — 87% of recruiters check LinkedIn first.", fix: "Add your LinkedIn profile URL." });
  } else score += 3;

  score += Math.min(20, generated.sections.length * 3);
  if (generated.sections.length < 4) {
    tips.push({ severity: "warning", category: "structure", text: "Resume has too few sections.", fix: "Add Skills, Projects, or Certifications." });
  }

  const text = JSON.stringify(generated).toLowerCase();
  const keywords = (targetRole || "").toLowerCase().split(/\s+/).filter((k) => k.length > 2);
  const found = keywords.filter((k) => text.includes(k)).length;
  score += Math.min(15, found * 5);
  if (keywords.length && found < keywords.length) {
    tips.push({ severity: "critical", category: "keywords", text: `Target role keywords missing — only ${found}/${keywords.length} found.`, fix: `Reinforce: "${targetRole}" in summary and bullets.` });
  }

  const skillCount =
    (content.skills?.technical?.length ?? 0) +
    (content.skills?.tools?.length ?? 0);
  if (skillCount < 5) {
    tips.push({ severity: "warning", category: "skills", text: "Fewer than 5 technical skills listed.", fix: "Add more relevant technical skills and tools." });
  } else score += 5;

  const allBullets = generated.sections.flatMap((s) => s.items.flatMap((i) => i.bullets ?? []));
  const quantified = allBullets.filter((b) => /\d/.test(b)).length;
  if (allBullets.length && quantified / allBullets.length < 0.5) {
    tips.push({ severity: "critical", category: "metrics", text: "Less than half of your bullets contain metrics.", fix: "Quantify achievements with %, $, or counts." });
  } else if (allBullets.length) {
    score += 5;
  }

  // Length checks
  const longBullets = allBullets.filter((b) => b.length > 200);
  if (longBullets.length > 0) {
    tips.push({ severity: "suggestion", category: "polish", text: `${longBullets.length} bullet(s) are too long (>200 chars).`, fix: "Trim verbose bullets to 80–150 characters." });
  }

  if (!content.personal?.summary && !generated.sections.some((s) => /summary|objective/i.test(s.title))) {
    tips.push({ severity: "suggestion", category: "structure", text: "No professional summary.", fix: "Add a 2–3 sentence summary at the top." });
  }

  if (tips.length === 0) tips.push({ severity: "suggestion", category: "polish", text: "Looking great — tailor each version to a specific job description.", fix: "Save a copy per role and tweak keywords." });

  return { score: Math.min(100, Math.max(0, score)), tips: tips.slice(0, 8) };
}

// Backwards-compat wrapper used by existing API routes
export function calculateAtsScore(
  content: ResumeContent,
  generated: GeneratedResume,
  targetRole: string
): { score: number; tips: string[] } {
  const v2 = calculateAtsScoreV2(content, generated, targetRole);
  return { score: v2.score, tips: v2.tips.map((t) => t.text) };
}
