import type { AtsTip } from "@/lib/ai/mock";

// Accept legacy string[] tips OR new structured tips
type RawTip = AtsTip | string;

export default function ImprovementTips({ tips }: { tips: RawTip[] }) {
  const normalized: AtsTip[] = tips.map((t) =>
    typeof t === "string"
      ? { severity: "suggestion" as const, category: "polish" as const, text: t }
      : t
  );

  if (normalized.length === 0) return null;

  const grouped = {
    critical: normalized.filter((t) => t.severity === "critical"),
    warning: normalized.filter((t) => t.severity === "warning"),
    suggestion: normalized.filter((t) => t.severity === "suggestion"),
  };

  return (
    <div className="space-y-4">
      <Group title="Critical fixes" tips={grouped.critical} icon="🔴" textColor="text-red-700" bg="bg-red-50" border="border-red-200" />
      <Group title="Warnings" tips={grouped.warning} icon="🟡" textColor="text-amber-700" bg="bg-amber-50" border="border-amber-200" />
      <Group title="Suggestions" tips={grouped.suggestion} icon="🟢" textColor="text-green-700" bg="bg-green-50" border="border-green-200" />
    </div>
  );
}

function Group({ title, tips, icon, textColor, bg, border }: {
  title: string; tips: AtsTip[]; icon: string; textColor: string; bg: string; border: string;
}) {
  if (!tips.length) return null;
  return (
    <div>
      <div className={`mb-2 text-[11px] font-semibold uppercase tracking-wider ${textColor}`}>
        {icon} {title} <span className="text-slate-400">({tips.length})</span>
      </div>
      <ul className="space-y-2">
        {tips.map((t, i) => (
          <li key={i} className={`rounded-lg border ${border} ${bg} px-3 py-2 text-sm`}>
            <div className={`font-medium ${textColor}`}>{t.text}</div>
            {t.fix && <div className="mt-1 text-xs text-slate-700">→ {t.fix}</div>}
          </li>
        ))}
      </ul>
    </div>
  );
}
