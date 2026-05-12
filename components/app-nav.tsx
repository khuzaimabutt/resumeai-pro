"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import SignOutButton from "@/components/sign-out-button";

type Profile = {
  full_name?: string | null;
  email?: string;
  user_type?: string;
  plan?: string | null;
  credits_remaining?: number;
};

export default function AppNav({ profile, email }: { profile: Profile | null; email: string }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const initials = (profile?.full_name ?? email ?? "U")
    .split(" ").map((p: string) => p[0]).slice(0, 2).join("").toUpperCase();
  const plan = (profile?.plan ?? "free").replace("_", " ");
  const credits = profile?.credits_remaining ?? 0;

  const links = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/pricing", label: "Pricing" },
    { href: "/settings", label: "Settings" },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="flex items-center gap-2 font-display text-lg font-bold">
            <span className="inline-block h-7 w-7 rounded-md bg-gradient-to-br from-brand to-gold" />
            ResumeAI <span className="text-gold">Pro</span>
          </Link>
          <nav className="hidden gap-1 md:flex">
            {links.map((l) => {
              const active = pathname === l.href || pathname.startsWith(l.href + "/");
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`rounded-md px-3 py-1.5 text-sm transition ${active ? "bg-brand/10 font-semibold text-brand" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/pricing"
            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 transition hover:border-brand/40 hover:bg-brand/5"
            title="Click to add more credits"
          >
            ⚡ {credits} credits
          </Link>
          <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${plan === "free" ? "bg-slate-100 text-slate-700" : "bg-gradient-to-r from-brand/10 to-gold/10 text-brand"}`}>
            {plan === "free" ? "Free plan" : plan}
          </span>

          <div ref={ref} className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand to-gold text-xs font-bold text-white shadow-sm transition hover:scale-105"
              aria-label="Account menu"
            >
              {initials}
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-11 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                <div className="border-b border-slate-100 px-3 py-2">
                  <div className="text-sm font-semibold">{profile?.full_name ?? "Welcome"}</div>
                  <div className="text-xs text-slate-500 truncate">{email}</div>
                </div>
                <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="block rounded px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50">Dashboard</Link>
                <Link href="/settings" onClick={() => setMenuOpen(false)} className="block rounded px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50">Settings</Link>
                <Link href="/pricing" onClick={() => setMenuOpen(false)} className="block rounded px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50">Pricing</Link>
                <div className="my-1 h-px bg-slate-100" />
                <div className="px-2 py-1">
                  <SignOutButton />
                </div>
              </div>
            )}
          </div>
        </div>

        <button
          className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-700 hover:bg-slate-100"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Open menu"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M3 5a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1zm0 5a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1zm1 4a1 1 0 1 0 0 2h12a1 1 0 1 0 0-2H4z"/></svg>
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white px-6 py-3 md:hidden">
          <div className="flex items-center gap-3 pb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand to-gold text-xs font-bold text-white">{initials}</div>
            <div>
              <div className="text-sm font-semibold">{profile?.full_name ?? "Welcome"}</div>
              <div className="text-xs text-slate-500">⚡ {credits} credits · <span className="capitalize">{plan}</span></div>
            </div>
          </div>
          <div className="grid gap-1 border-t border-slate-100 pt-3">
            {links.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">{l.label}</Link>
            ))}
            <div className="my-1 h-px bg-slate-100" />
            <div className="px-3 py-1"><SignOutButton /></div>
          </div>
        </div>
      )}
    </header>
  );
}
