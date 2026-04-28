import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { renderPdfFromUrl } from "@/lib/pdf/generate";

export const maxDuration = 60;

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: resume } = await supabase.from("resumes").select("title, generated, content").eq("id", params.id).single();
  if (!resume || !resume.generated) {
    return NextResponse.json({ error: "Resume not generated yet" }, { status: 400 });
  }

  const h = headers();
  const host = h.get("host") || "localhost:3000";
  const proto = h.get("x-forwarded-proto") || (host.startsWith("localhost") ? "http" : "https");
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || `${proto}://${host}`;

  const token = process.env.PDF_FETCH_TOKEN;
  const url = `${baseUrl}/resume-pdf/${params.id}${token ? `?token=${token}` : ""}`;

  try {
    const pdf = await renderPdfFromUrl(url);
    const fullName = ((resume.content as any)?.personal?.full_name as string) || "resume";
    const safeName = fullName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    return new NextResponse(pdf as any, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${safeName}-resume.pdf"`,
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: "PDF generation failed: " + (e.message ?? e) }, { status: 500 });
  }
}
