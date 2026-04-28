import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const PLAN_INFO: Record<string, { credits: number; cents: number }> = {
  fresher_pack: { credits: 3, cents: 500 },
  pro_monthly: { credits: 20, cents: 1200 },
  professional_pack: { credits: 5, cents: 2500 },
};

export async function POST(req: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const plan = body.plan as keyof typeof PLAN_INFO;
  if (!PLAN_INFO[plan]) return NextResponse.json({ error: "Invalid plan" }, { status: 400 });

  // MOCK MODE: instantly credit the account, log the payment, redirect to success.
  if (process.env.MOCK_PAYMENTS !== "false") {
    const info = PLAN_INFO[plan];
    const { data: profile } = await supabase.from("profiles")
      .select("credits_remaining").eq("id", user.id).single();
    const newCredits = (profile?.credits_remaining ?? 0) + info.credits;
    await supabase.from("profiles").update({
      plan, credits_remaining: newCredits,
    }).eq("id", user.id);
    await supabase.from("payments").insert({
      user_id: user.id,
      amount_cents: info.cents,
      plan_purchased: plan,
      status: "succeeded",
      is_mock: true,
    });
    return NextResponse.json({ mock_url: `/checkout/success?plan=${plan}` });
  }

  // Real Stripe path would go here (kept simple — just an error so it's obvious).
  return NextResponse.json({ error: "Real Stripe not configured. Set MOCK_PAYMENTS=true." }, { status: 500 });
}
