"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-navy bg-hero-mesh text-white">
      <div className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-6 text-center">
        <div className="mb-6 text-6xl">😬</div>
        <h1 className="font-display text-3xl font-bold">Something went wrong</h1>
        <p className="mt-2 max-w-md text-white/60">
          We hit an unexpected error. Try refreshing — if it persists, send us the digest below.
        </p>
        {error.digest && (
          <code className="mt-3 rounded bg-white/5 px-2 py-1 text-xs text-white/50">{error.digest}</code>
        )}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button onClick={reset} className="btn-primary">Try again</button>
          <Link href="/" className="btn-ghost">Back home</Link>
        </div>
      </div>
    </div>
  );
}
