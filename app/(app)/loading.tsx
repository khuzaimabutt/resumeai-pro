import { ResumeCardSkeleton, StatSkeleton } from "@/components/skeleton";

export default function Loading() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <div className="skeleton h-9 w-64" />
        <div className="skeleton h-4 w-80" />
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        <StatSkeleton /><StatSkeleton /><StatSkeleton /><StatSkeleton />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <ResumeCardSkeleton /><ResumeCardSkeleton /><ResumeCardSkeleton />
      </div>
    </div>
  );
}
