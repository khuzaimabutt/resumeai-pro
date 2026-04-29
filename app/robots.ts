import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://resumeai-pro-taupe.vercel.app";
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/login", "/signup", "/pricing"],
      disallow: ["/dashboard", "/builder", "/preview", "/settings", "/api", "/checkout"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
