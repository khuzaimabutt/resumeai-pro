export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-navy bg-hero-mesh text-white">
      <div className="mx-auto flex min-h-screen max-w-md items-center justify-center px-6 py-10">
        {children}
      </div>
    </div>
  );
}
