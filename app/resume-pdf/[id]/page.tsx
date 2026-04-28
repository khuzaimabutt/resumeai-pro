import { notFound } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/server";
import ResumeRenderer from "@/components/resume-renderer";
import type { GeneratedResume } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ResumePdfPage({
  params, searchParams,
}: { params: { id: string }; searchParams: { token?: string } }) {
  // Authenticated server-to-server fetch (Puppeteer comes through with a token).
  if (searchParams.token !== process.env.PDF_FETCH_TOKEN && process.env.PDF_FETCH_TOKEN) {
    return <div className="p-10 text-center text-red-600">Unauthorized</div>;
  }

  const supabase = createServiceClient();
  const { data: resume } = await supabase
    .from("resumes")
    .select("*")
    .eq("id", params.id)
    .single();
  if (!resume || !resume.generated) notFound();

  const generated = resume.generated as GeneratedResume;
  const personal = (resume.content as any)?.personal ?? {};

  return (
    <html>
      <body style={{ background: "white", margin: 0 }}>
        <ResumeRenderer
          generated={generated}
          fullName={personal.full_name || "Resume"}
          contact={personal}
          targetRole={resume.target_role ?? ""}
        />
      </body>
    </html>
  );
}
