export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-navy">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-brand" />
        <div className="text-xs uppercase tracking-widest text-white/50">Loading…</div>
      </div>
    </div>
  );
}
