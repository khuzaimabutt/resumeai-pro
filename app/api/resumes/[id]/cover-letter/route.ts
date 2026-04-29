import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { GeneratedResume, ResumeContent, UserType } from "@/lib/types";

export const maxDuration = 30;

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const company: string = body.company ?? "Acme Corp";
  const role: string = body.role ?? "";
  const tone: "formal" | "warm" | "confident" = body.tone ?? "warm";

  const { data: resume } = await supabase.from("resumes").select("*").eq("id", params.id).single();
  if (!resume) return NextResponse.json({ error: "Resume not found" }, { status: 404 });

  await new Promise((r) => setTimeout(r, 800 + Math.random() * 1000));

  const content = (resume.content as ResumeContent) ?? {};
  const generated = resume.generated as GeneratedResume | null;
  const name = content.personal?.full_name ?? "Your Name";
  const targetRole = role || resume.target_role || "the role";
  const userType: UserType = (resume.user_type as UserType) ?? "intermediate";

  const opener = {
    formal: `Dear ${company} Hiring Team,`,
    warm: `Hi ${company} team,`,
    confident: `${company} hiring team —`,
  }[tone];

  const skills = [
    ...(content.skills?.technical ?? []),
    ...(content.skills?.tools ?? []),
  ].slice(0, 4);

  const closer = {
    formal: `Sincerely,\n${name}`,
    warm: `Looking forward to hearing from you,\n${name}`,
    confident: `Talk soon,\n${name}`,
  }[tone];

  const middleByLevel: Record<UserType, string[]> = {
    fresher: [
      `Throughout my degree and ${(content.projects?.length ?? 0) || 3}+ side projects, I've built hands-on experience with ${skills.join(", ") || "modern tooling"}. I'm drawn to ${company} specifically for its product polish and the impact your team has on millions of users.`,
      `I bring strong fundamentals, fast learning, and a builder's mindset. I treat unclear requirements as a puzzle to solve, ship code with thoughtful tests, and document my decisions for the next person.`,
    ],
    intermediate: [
      `I'm reaching out because I'm excited about the ${targetRole} position at ${company}. Over the past ${content.personal?.years_experience || 4}+ years I've shipped production systems using ${skills.join(", ") || "the modern web stack"} — most recently ${(generated?.sections.find((s) => /experience/i.test(s.title))?.items[0]?.bullets?.[0] ?? "leading initiatives that moved key business metrics").toLowerCase()}.`,
      `What sets me apart is the way I bridge engineering judgment with cross-functional partnership. I default to writing simple, reliable code, but I'm equally comfortable in a customer call, a design review, or a postmortem.`,
    ],
    professional: [
      `I'm writing about the ${targetRole} opportunity at ${company}. Across ${content.personal?.years_experience || 10}+ years of senior leadership, I've built and scaled high-performing teams, owned P&L, and delivered initiatives that compounded into durable competitive advantage.`,
      `What ${company} is building resonates with me because of how serious you are about both craft and customer outcome. I'd bring a track record of operational excellence, a cross-functional executive presence, and a relentless focus on hiring and developing world-class talent.`,
    ],
  };

  const lines = [
    opener,
    "",
    `I'm writing to apply for the ${targetRole} position at ${company}.`,
    "",
    ...middleByLevel[userType],
    "",
    `I'd welcome the chance to discuss how my background could contribute to ${company}. Thanks for your consideration.`,
    "",
    closer,
  ];

  const text = lines.join("\n").trim();
  return NextResponse.json({ text });
}
