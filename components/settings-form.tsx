"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { UserType } from "@/lib/types";

export default function SettingsForm({ profile }: { profile: any }) {
  const [fullName, setFullName] = useState(profile?.full_name ?? "");
  const [userType, setUserType] = useState<UserType>(profile?.user_type ?? "fresher");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  async function save() {
    setLoading(true);
    const supabase = createClient();
    await supabase.from("profiles").update({ full_name: fullName, user_type: userType }).eq("id", profile.id);
    setLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="font-display text-lg font-semibold">Profile</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className="label">Full name</label>
            <input className="input" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input" value={profile?.email ?? ""} disabled />
          </div>
          <div>
            <label className="label">User type</label>
            <select className="input" value={userType} onChange={(e) => setUserType(e.target.value as UserType)}>
              <option value="fresher">Fresher</option>
              <option value="intermediate">Intermediate</option>
              <option value="professional">Professional</option>
            </select>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <button onClick={save} disabled={loading} className="btn-primary">{loading ? "Saving..." : "Save changes"}</button>
          {saved && <span className="text-sm text-green-600">Saved ✓</span>}
        </div>
      </div>

      <div className="card">
        <h2 className="font-display text-lg font-semibold">Plan & credits</h2>
        <p className="mt-2 text-sm text-slate-600">
          Current plan: <strong className="capitalize">{(profile?.plan ?? "free").replace("_", " ")}</strong>
          {" · "}Credits remaining: <strong>{profile?.credits_remaining ?? 0}</strong>
        </p>
        <a href="/pricing" className="btn-primary mt-4 inline-flex">Upgrade →</a>
      </div>
    </div>
  );
}
