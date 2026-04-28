import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ResumeAI Pro — Build a Resume That Gets You Hired",
  description:
    "AI-powered resume builder tailored to fresher, intermediate, or professional candidates. ATS-optimized, PDF export, instant cover letters.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
