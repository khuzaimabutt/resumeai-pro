"use client";

export function passwordScore(p: string): { score: number; label: string; color: string } {
  let s = 0;
  if (p.length >= 8) s++;
  if (p.length >= 12) s++;
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) s++;
  if (/\d/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  s = Math.min(s, 4);
  const labels = ["Too short", "Weak", "Fair", "Good", "Strong"];
  const colors = ["bg-red-500", "bg-red-400", "bg-yellow-400", "bg-blue-400", "bg-green-500"];
  return { score: s, label: labels[s], color: colors[s] };
}

export default function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;
  const { score, label, color } = passwordScore(password);
  return (
    <div className="mt-2 space-y-1">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition ${i < score ? color : "bg-white/10"}`}
          />
        ))}
      </div>
      <div className="text-[11px] text-white/60">
        Strength: <span className="font-medium">{label}</span>
      </div>
    </div>
  );
}
