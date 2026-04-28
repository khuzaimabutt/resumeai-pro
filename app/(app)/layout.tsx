import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SignOutButton from "@/components/sign-out-button";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email, user_type, plan, credits_remaining")
    .eq("id", user.id)
    .single();

  const initials = (profile?.full_name ?? user.email ?? "U")
    .split(" ").map((p: string) => p[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className="min-h-screen bg-soft text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <Link href="/dashboard" className="flex items-center gap-2 font-display text-lg font-bold">
            <span className="inline-block h-6 w-6 rounded-md bg-gradient-to-br from-brand to-gold" />
            ResumeAI <span className="text-gold">Pro</span>
          </Link>
          <nav className="hidden gap-5 text-sm text-slate-600 md:flex">
            <Link href="/dashboard" className="hover:text-slate-900">Dashboard</Link>
            <Link href="/settings" className="hover:text-slate-900">Settings</Link>
            <Link href="/pricing" className="hover:text-slate-900">Pricing</Link>
          </nav>
          <div className="flex items-center gap-3">
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">
              {profile?.credits_remaining ?? 0} credits
            </span>
            <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-medium text-brand capitalize">
              {profile?.plan?.replace("_", " ") ?? "free"}
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand to-gold text-xs font-bold text-white">
              {initials}
            </div>
            <SignOutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}
