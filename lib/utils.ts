export function cn(...args: (string | undefined | false | null)[]): string {
  return args.filter(Boolean).join(" ");
}

export function formatDate(d: string | Date): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function scoreColor(score: number): string {
  if (score >= 80) return "text-green-600 bg-green-50 border-green-200";
  if (score >= 60) return "text-yellow-700 bg-yellow-50 border-yellow-200";
  return "text-red-600 bg-red-50 border-red-200";
}
