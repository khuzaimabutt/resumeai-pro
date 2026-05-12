import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { Document, Packer, Paragraph, HeadingLevel, TextRun, AlignmentType } from "docx";
import type { GeneratedResume, ResumeContent } from "@/lib/types";

export const maxDuration = 30;

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
  const personal = content.personal ?? {};

  const children: Paragraph[] = [];

  children.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: personal.full_name ?? "Your Name", bold: true, size: 36 })],
  }));
  if (resume.target_role) {
    children.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: resume.target_role, size: 22, color: "2563EB" })],
    }));
  }
  children.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({
      text: [personal.email, personal.phone, personal.location, personal.linkedin].filter(Boolean).join(" · "),
      size: 18, color: "666666",
    })],
  }));
  children.push(new Paragraph({ text: "" }));

  for (const section of generated.sections) {
    children.push(new Paragraph({
      heading: HeadingLevel.HEADING_2,
      children: [new TextRun({ text: section.title, bold: true, size: 22, color: "2563EB" })],
    }));

    for (const item of section.items) {
      if (item.heading) {
        const head = [
          new TextRun({ text: item.heading, bold: true, size: 22 }),
        ];
        if (item.meta) head.push(new TextRun({ text: `   ${item.meta}`, size: 18, color: "666666" }));
        children.push(new Paragraph({ children: head }));
      }
      if (item.subheading) {
        children.push(new Paragraph({
          children: [new TextRun({ text: item.subheading, italics: true, size: 20, color: "555555" })],
        }));
      }
      if (item.body) {
        children.push(new Paragraph({ children: [new TextRun({ text: item.body, size: 20 })] }));
      }
      if (item.bullets) {
        for (const b of item.bullets) {
          children.push(new Paragraph({
            text: b,
            bullet: { level: 0 },
          }));
        }
      }
      if (item.tags && item.tags.length > 0) {
        children.push(new Paragraph({
          children: [new TextRun({ text: item.tags.join(" · "), size: 18, color: "666666" })],
        }));
      }
      children.push(new Paragraph({ text: "" }));
    }
  }

  const doc = new Document({ sections: [{ properties: {}, children }] });
  const buf = await Packer.toBuffer(doc);
  const bytes = new Uint8Array(buf);

  const filename = `${(personal.full_name ?? "resume").replace(/\s+/g, "_")}.docx`;
  return new NextResponse(bytes, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
