import "./globals.css";
import type { Metadata } from "next";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "ResumeAI Pro — Build a Resume That Gets You Hired",
  description:
    "AI-powered resume builder tailored to fresher, intermediate, or professional candidates. ATS-optimized, PDF export, instant cover letters.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  openGraph: {
    title: "ResumeAI Pro",
    description: "AI-powered resume builder. ATS-optimized. Land interviews 3x faster.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ResumeAI Pro",
    description: "AI-powered resume builder. ATS-optimized.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster position="top-right" theme="dark" richColors closeButton />
      </body>
    </html>
  );
}
