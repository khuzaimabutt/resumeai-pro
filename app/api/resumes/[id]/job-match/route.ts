import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { GeneratedResume } from "@/lib/types";

export const maxDuration = 15;

const STOP_WORDS = new Set([
  "the","a","an","and","or","but","is","are","was","were","be","been","being","to","of","in","on","at","for","with","by","from","up","about","into","over","after","before","under","this","that","these","those","i","you","he","she","it","we","they","my","your","his","her","its","our","their","as","if","then","else","not","no","do","does","did","done","have","has","had","will","would","should","could","may","might","can","yes","also","so","very","more","most","just","only","than","too","what","when","where","which","who","whom","whose","why","how","each","other","some","any","all","both","few","several","such","own","same","need","needed","plus","including","etc","using","use"
]);

function tokenize(text: string): string[] {
  return text.toLowerCase()
    .replace(/[^\p{L}\p{N}+#./-]/gu, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 2 && !STOP_WORDS.has(w));
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const jd: string = body.job_description ?? "";
  if (jd.trim().length < 50) {
    return NextResponse.json({ error: "Paste a longer job description (50+ chars)" }, { status: 400 });
  }

  const { data: resume } = await supabase.from("resumes").select("*").eq("id", params.id).single();
  if (!resume || !resume.generated) {
    return NextResponse.json({ error: "Generate the resume first." }, { status: 400 });
  }

  await new Promise((r) => setTimeout(r, 600 + Math.random() * 700));

  const generated = resume.generated as GeneratedResume;
  const resumeText = JSON.stringify(generated).toLowerCase() + " " + JSON.stringify(resume.content ?? {}).toLowerCase();

  const jdTokens = Array.from(new Set(tokenize(jd)));
  const matched = jdTokens.filter((t) => resumeText.includes(t));
  const missing = jdTokens.filter((t) => !resumeText.includes(t));

  // Score weighted toward higher-signal tokens (longer)
  const weight = (w: string) => (w.length >= 5 ? 2 : 1);
  const totalWeight = jdTokens.reduce((s, w) => s + weight(w), 0);
  const matchedWeight = matched.reduce((s, w) => s + weight(w), 0);
  const score = totalWeight > 0 ? Math.round((matchedWeight / totalWeight) * 100) : 0;

  // Pick top "important" missing keywords (likely tech/skills, length >= 3, not all numeric)
  const importantMissing = missing
    .filter((w) => w.length >= 3 && !/^\d+$/.test(w))
    .sort((a, b) => b.length - a.length)
    .slice(0, 14);

  return NextResponse.json({
    match_score: score,
    matched_count: matched.length,
    total_keywords: jdTokens.length,
    missing_keywords: importantMissing,
  });
}
