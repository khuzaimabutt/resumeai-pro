import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { GeneratedResume, ResumeContent } from "@/lib/types";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: resume } = await supabase.from("resumes").select("*").eq("id", params.id).single();
  if (!resume || !resume.generated) {
    return NextResponse.json({ error: "Not generated yet" }, { status: 400 });
  }

  const generated = resume.generated as GeneratedResume;
  const content = (resume.content as ResumeContent) ?? {};
  const p = content.personal ?? {};

  const lines: string[] = [];
  lines.push((p.full_name ?? "Your Name").toUpperCase());
  if (resume.target_role) lines.push(resume.target_role);
  lines.push([p.email, p.phone, p.location, p.linkedin].filter(Boolean).join(" | "));
  lines.push("");

  for (const section of generated.sections) {
    lines.push(section.title);
    lines.push("=".repeat(Math.max(20, section.title.length)));
    for (const item of section.items) {
      if (item.heading) lines.push(item.heading + (item.meta ? `  (${item.meta})` : ""));
      if (item.subheading) lines.push(item.subheading);
      if (item.body) lines.push(item.body);
      if (item.bullets) for (const b of item.bullets) lines.push(`  - ${b}`);
      if (item.tags && item.tags.length) lines.push(`  ${item.tags.join(" · ")}`);
      lines.push("");
    }
    lines.push("");
  }

  const filename = `${(p.full_name ?? "resume").replace(/\s+/g, "_")}.txt`;
  return new NextResponse(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
